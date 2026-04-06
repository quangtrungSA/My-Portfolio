# Deployment Guide

## Current Production Setup

| Service | Platform | Region | Always On? |
|---------|----------|--------|------------|
| Frontend | **Google Cloud Run** | asia-southeast1 | Yes |
| Backend | **Oracle Cloud** Always Free VM | Choose closest | Yes (never shuts down) |
| Database | **Neon** | Singapore | Yes |

---

## Backend: Oracle Cloud Always Free VM

### Why Oracle Cloud?
- **Always Free** - never expires, no credit card charge
- **Never shuts down** - unlike Render (15 min idle) or Fly.io (auto-stop)
- **Ampere A1 ARM** - up to 4 cores + 24 GB RAM (free forever)
- **Full control** - SSH, Docker, Nginx, custom domain, SSL

### Step 1: Create Oracle Cloud Account

1. Go to [cloud.oracle.com](https://cloud.oracle.com) - Sign up (free)
2. Choose Home Region closest to users (e.g. ap-singapore-1, ap-tokyo-1)
3. Complete verification (credit card for identity only, never charged for Always Free)

### Step 2: Create an Always Free VM

1. Compute - Instances - Create Instance
2. Configure:

| Setting | Value |
|---------|-------|
| Name | portfolio-backend |
| Image | Ubuntu 22.04 (aarch64) |
| Shape | VM.Standard.A1.Flex |
| OCPUs | 2 (of 4 free) |
| Memory | 12 GB (of 24 free) |
| Boot volume | 50 GB (of 200 GB free) |
| Network | Create new VCN + public subnet |
| SSH Key | Upload ~/.ssh/id_rsa.pub |

3. Click Create - Wait for Running status
4. Note the Public IP Address

### Step 3: Configure Security List (Firewall)

Oracle Cloud has two layers: Security List (cloud) + iptables (VM).

In Oracle Cloud Console:
1. Networking - Virtual Cloud Networks - your VCN
2. Security Lists - Default Security List
3. Add Ingress Rules:

| Source CIDR | Protocol | Dest Port | Description |
|-------------|----------|-----------|-------------|
| 0.0.0.0/0 | TCP | 80 | HTTP |
| 0.0.0.0/0 | TCP | 443 | HTTPS |

> Do NOT open port 8080 publicly - Nginx proxies internally.

### Step 4: Setup VM (First Time)

```bash
ssh -i ~/.ssh/oracle_vm_key ubuntu@YOUR_ORACLE_VM_IP

sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
sudo apt-get install -y docker-compose-plugin

# Install Nginx + Certbot
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Open ports in iptables (Oracle Ubuntu blocks 80/443 by default!)
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save

sudo reboot
```

Or use: `./scripts/deploy-oracle.sh --setup`

### Step 5: Configure Nginx Reverse Proxy

See `scripts/nginx-oracle.conf` for reference config. Copy it to the VM:

```bash
sudo cp nginx-oracle.conf /etc/nginx/sites-available/portfolio
# Edit server_name to your domain/IP
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### Step 6: SSL with Let's Encrypt (requires domain)

```bash
sudo certbot --nginx -d api.yourdomain.com
sudo certbot renew --dry-run
```

No domain? Use [DuckDNS](https://www.duckdns.org) for a free subdomain.

### Step 7: Create .env File on VM

```bash
mkdir -p ~/portfolio-backend/backend
cat > ~/portfolio-backend/backend/.env << 'EOF'
NEON_JDBC_URL=jdbc:postgresql://your-neon-host/neondb?sslmode=require
NEON_USERNAME=neondb_owner
NEON_PASSWORD=your-password
JWT_SECRET=your-super-secret-key-at-least-64-characters-long
EOF
```

### Step 8: Deploy Backend

```bash
export ORACLE_VM_IP=xxx.xxx.xxx.xxx
export ORACLE_SSH_KEY=~/.ssh/oracle_vm_key
./scripts/deploy-oracle.sh
```

### Step 9: Update Vercel API_URL

```bash
cd frontend
vercel env rm API_URL production
vercel env add API_URL production   # enter https://api.yourdomain.com
vercel --prod
```

---

## CI/CD (GitHub Actions)

| Job | What it does | Duration |
|-----|-------------|----------|
| test-backend | Java 21 + Gradle build and test | ~2 min |
| test-frontend | Node 22 + pnpm build and lint | ~1 min |
| docker-build | Build both Docker images | ~3 min |
| deploy-backend | SSH - Oracle VM - rebuild container | ~2 min |

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| ORACLE_VM_IP | Oracle Cloud VM public IP |
| ORACLE_SSH_USER | SSH username (default: ubuntu) |
| ORACLE_SSH_PRIVATE_KEY | SSH private key (full PEM content) |

Add at: GitHub repo - Settings - Secrets and variables - Actions.

---

## Auto-Deploy Flow

```
git push origin main
    |
    +--> GitHub Actions CI (test + build)
    +--> GitHub Actions deploys to Cloud Run (~1 min)
    +--> GitHub Actions SSH - Oracle VM - docker compose up (~2 min)
```
