# Deployment Guide

## Current Production Setup

```
User Browser
    │
    ▼
Vercel (Frontend)              Fly.io (Backend)               Neon (Database)
Next.js 14                     Spring Boot 3.4                PostgreSQL 17
frontend-two-tan-77.vercel.app portfolio-backend-trung.fly.dev ap-southeast-1.aws.neon.tech
    │                              │                              │
    └── /api/* rewrites ──────────►│                              │
                                   └── JDBC + SSL ───────────────►│
```

| Service | URL | Platform | Region |
|---------|-----|----------|--------|
| Frontend | https://frontend-two-tan-77.vercel.app | Vercel | Edge (global) |
| Backend | https://portfolio-backend-trung.fly.dev | Fly.io | Singapore (sin) |
| Database | Neon pooler endpoint | Neon | Singapore (ap-southeast-1) |
| Source Code | https://github.com/quangtrungSA/My-Portfolio | GitHub | - |

---

## Option A: Fly.io (Current Backend - Recommended)

### Deploy Backend

```bash
# Install Fly CLI
brew install flyctl

# Login
fly auth login

# Deploy (from backend/ directory)
cd backend
fly deploy

# Set secrets (first time only)
fly secrets set \
  NEON_JDBC_URL="jdbc:postgresql://..." \
  NEON_USERNAME="neondb_owner" \
  NEON_PASSWORD="your-password" \
  JWT_SECRET="your-64-char-secret"

# Check status
fly status
fly logs
```

### Fly.io Free Tier
- 3 shared-cpu VMs (256 MB each)
- Auto-stop when idle (saves resources)
- Auto-start on incoming request (~5-10s cold start)
- 160 GB outbound bandwidth/month

### Config: `backend/fly.toml`
```toml
app = 'portfolio-backend-trung'
primary_region = 'sin'          # Singapore
```

---

## Option B: Render (Alternative Backend)

### Deploy via Web UI

1. Go to https://render.com → Sign up → Connect GitHub
2. New → Web Service → Select `quangtrungSA/My-Portfolio`
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `portfolio-backend` |
| Region | Singapore |
| Root Directory | `backend` |
| Runtime | Docker |
| Plan | Free |

4. Add env vars: `NEON_JDBC_URL`, `NEON_USERNAME`, `NEON_PASSWORD`, `JWT_SECRET`
5. Create Web Service

### Render Free Tier
- Spins down after 15 min idle (~30-60s cold start)
- 750 hours/month
- Auto-deploy from GitHub

---

## Deploy Frontend to Vercel

### Via CLI (Fastest)

```bash
cd frontend

# Login (first time)
vercel login

# Set env var
vercel env add API_URL production --value "https://portfolio-backend-trung.fly.dev" --yes

# Deploy to production
vercel --prod --yes
```

### Via Web UI

1. Go to https://vercel.com → Sign up → Connect GitHub
2. Import `quangtrungSA/My-Portfolio`
3. Configure:

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Root Directory | `frontend` |

4. Add Environment Variable:

| Key | Value |
|-----|-------|
| `API_URL` | `https://portfolio-backend-trung.fly.dev` |

5. Deploy

### Vercel Free Tier
- 100 GB bandwidth/month
- Unlimited deployments
- Auto-deploy on every push to `main`
- Edge network (global CDN)

---

## Docker (Local / Self-Hosted)

```bash
# Create .env at project root
cat > .env << 'EOF'
NEON_JDBC_URL=jdbc:postgresql://...
NEON_USERNAME=neondb_owner
NEON_PASSWORD=your-password
JWT_SECRET=your-64-char-secret
EOF

# Build and run
docker compose up --build

# Access
# Frontend: http://localhost:3000
# Backend:  http://localhost:8080
```

---

## CI/CD (GitHub Actions)

`.github/workflows/ci.yml` runs automatically on every push/PR to `main`:

| Job | What it does | Duration |
|-----|-------------|----------|
| test-backend | Java 21 + Gradle build & test | ~2 min |
| test-frontend | Node 22 + pnpm build & lint | ~1 min |
| docker-build | Build both Docker images | ~3 min |

---

## Environment Variables Reference

### Backend (Fly.io / Render / Docker)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEON_JDBC_URL` | Yes | PostgreSQL JDBC connection URL |
| `NEON_USERNAME` | Yes | Database username |
| `NEON_PASSWORD` | Yes | Database password |
| `JWT_SECRET` | Production | JWT signing key (64+ chars recommended) |
| `MAIL_HOST` | No | SMTP server (default: smtp.gmail.com) |
| `MAIL_USERNAME` | No | SMTP username |
| `MAIL_PASSWORD` | No | SMTP password |

### Frontend (Vercel)

| Variable | Required | Description |
|----------|----------|-------------|
| `API_URL` | Production | Backend URL (e.g. https://portfolio-backend-trung.fly.dev) |

---

## Verify Deployment

```bash
# Frontend loads
curl -s -o /dev/null -w "%{http_code}" https://frontend-two-tan-77.vercel.app

# API proxy works (Vercel → Fly.io → Neon)
curl -s https://frontend-two-tan-77.vercel.app/api/profiles | head -100

# Backend directly
curl -s https://portfolio-backend-trung.fly.dev/api/skills

# Admin login
curl -s -X POST https://portfolio-backend-trung.fly.dev/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"changeme"}'
```

---

## Custom Domain (Optional)

### Vercel
```bash
vercel domains add yourdomain.com
```
Or: Vercel Dashboard → Settings → Domains

### Fly.io
```bash
fly certs create yourdomain.com
# Add CNAME: yourdomain.com → portfolio-backend-trung.fly.dev
```

---

## Auto-Deploy Workflow

```
git push origin main
    │
    ├──→ GitHub Actions CI (test + build check)
    │
    ├──→ Vercel auto-deploys frontend (~1 min)
    │
    └──→ Backend: manual `fly deploy` (or set up Fly.io GitHub integration)
```

To enable auto-deploy for Fly.io backend:
```bash
fly deploy --remote-only  # Uses Fly.io's remote builder
```
Or connect via Fly.io Dashboard → Settings → GitHub Integration.
