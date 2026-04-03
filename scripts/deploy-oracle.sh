#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# deploy-oracle.sh  –  Deploy backend to Oracle Cloud Always Free VM
#
# Usage:
#   export ORACLE_VM_IP=xxx.xxx.xxx.xxx
#   export ORACLE_SSH_KEY=~/.ssh/oracle_vm_key
#   ./scripts/deploy-oracle.sh              # deploy / update
#   ./scripts/deploy-oracle.sh --setup      # first-time VM setup
#
# Prerequisites:
#   - Oracle Cloud Always Free VM (Ampere A1, Ubuntu 22.04+)
#   - SSH key added to VM during provisioning
#   - Security list: allow TCP 22, 80, 443
# ─────────────────────────────────────────────────────────────────

set -euo pipefail

ORACLE_VM_IP="${ORACLE_VM_IP:-""}"
ORACLE_SSH_KEY="${ORACLE_SSH_KEY:-~/.ssh/oracle_vm_key}"
ORACLE_SSH_USER="${ORACLE_SSH_USER:-ubuntu}"
APP_DIR="/home/${ORACLE_SSH_USER}/portfolio-backend"
DOMAIN="${ORACLE_DOMAIN:-}"  # e.g., api.yourdomain.com (for SSL)

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ── Validate ────────────────────────────────────────────────────
if [[ -z "$ORACLE_VM_IP" ]]; then
  echo -e "${RED}❌  ORACLE_VM_IP is not set.${NC}"
  echo "   export ORACLE_VM_IP=xxx.xxx.xxx.xxx"
  exit 1
fi

SSH_CMD="ssh -o StrictHostKeyChecking=no -i ${ORACLE_SSH_KEY} ${ORACLE_SSH_USER}@${ORACLE_VM_IP}"

# ── First-time VM setup ────────────────────────────────────────
if [[ "${1:-}" == "--setup" ]]; then
  echo -e "${YELLOW}🔧  Setting up Oracle Cloud VM (first time)...${NC}"

  $SSH_CMD << 'SETUP_EOF'
set -e

echo ">>> Updating packages..."
sudo apt-get update && sudo apt-get upgrade -y

echo ">>> Installing Docker..."
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

echo ">>> Installing Docker Compose plugin..."
sudo apt-get install -y docker-compose-plugin

echo ">>> Installing Nginx..."
sudo apt-get install -y nginx

echo ">>> Installing Certbot..."
sudo apt-get install -y certbot python3-certbot-nginx

echo ">>> Configuring iptables (open 80, 443, block 8080 from public)..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
# Block direct access to 8080 from outside (only Nginx proxies)
sudo iptables -A INPUT -p tcp --dport 8080 -j DROP
sudo netfilter-persistent save

echo ">>> Creating app directory..."
mkdir -p ~/portfolio-backend

echo "✅  VM setup complete! Reboot to apply docker group, then run deploy."
SETUP_EOF

  echo -e "${GREEN}✅  Setup commands sent. SSH into VM and reboot: sudo reboot${NC}"
  exit 0
fi

# ── Deploy / Update ────────────────────────────────────────────
echo -e "${YELLOW}🚀  Deploying backend to Oracle Cloud VM (${ORACLE_VM_IP})...${NC}"

# 1. Copy necessary files
echo ">>> Uploading files..."
scp -o StrictHostKeyChecking=no -i "${ORACLE_SSH_KEY}" \
  -r backend/Dockerfile backend/build.gradle backend/settings.gradle \
     backend/gradlew backend/src backend/gradle \
  "${ORACLE_SSH_USER}@${ORACLE_VM_IP}:${APP_DIR}/"

# 2. Copy docker-compose for backend-only
cat <<'COMPOSE_EOF' | $SSH_CMD "cat > ${APP_DIR}/docker-compose.yml"
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "127.0.0.1:8080:8080"
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/api/profiles"]
      interval: 30s
      timeout: 5s
      start_period: 60s
      retries: 3
COMPOSE_EOF

# 3. Build and restart
echo ">>> Building and starting container..."
$SSH_CMD << DEPLOY_EOF
set -e
cd ${APP_DIR}
chmod +x gradlew
docker compose down --remove-orphans 2>/dev/null || true
docker compose up --build -d
echo ">>> Waiting for health check (60s startup)..."
sleep 15
docker compose ps
DEPLOY_EOF

# 4. Health check
echo ">>> Running health check..."
sleep 10
HTTP_CODE=$($SSH_CMD "curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/api/profiles" 2>/dev/null || echo "000")

if [[ "$HTTP_CODE" == "200" ]]; then
  echo -e "${GREEN}✅  Backend is healthy! (HTTP ${HTTP_CODE})${NC}"
else
  echo -e "${YELLOW}⚠️   Health check returned HTTP ${HTTP_CODE} (may still be starting up)${NC}"
  echo "   Check logs: ssh ${ORACLE_SSH_USER}@${ORACLE_VM_IP} 'cd ${APP_DIR} && docker compose logs -f'"
fi

echo -e "${GREEN}🎉  Deploy complete!${NC}"
echo "   Backend: http://${ORACLE_VM_IP}:8080 (local only, use Nginx)"
if [[ -n "$DOMAIN" ]]; then
  echo "   Public:  https://${DOMAIN}"
fi

