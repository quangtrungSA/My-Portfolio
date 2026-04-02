#!/bin/bash
# ─────────────────────────────────────────────────────────────
# start-dev-tunnel.sh
# Khởi động Spring Boot backend + Cloudflare Tunnel
# Dùng khi cần API hoạt động tạm thời (không cần server cloud)
#
# Usage:  ./scripts/start-dev-tunnel.sh
# ─────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$ROOT_DIR/backend/.env"
LOG_BACKEND="/tmp/portfolio-backend.log"
LOG_TUNNEL="/tmp/portfolio-tunnel.log"

# ── Load env vars ──────────────────────────────────────────────
if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌  $ENV_FILE not found. Create it with NEON_JDBC_URL, NEON_USERNAME, NEON_PASSWORD, JWT_SECRET"
  exit 1
fi

export $(grep -v '^#' "$ENV_FILE" | xargs)
echo "✅  Loaded env vars from $ENV_FILE"

# ── Kill any existing processes on port 8080 ──────────────────
PID_8080=$(lsof -ti:8080 2>/dev/null || true)
if [[ -n "$PID_8080" ]]; then
  echo "⚠️   Killing existing process on port 8080 (PID $PID_8080)..."
  kill "$PID_8080" 2>/dev/null || true
  sleep 2
fi
pkill -f "cloudflared tunnel" 2>/dev/null || true

# ── Start Spring Boot ─────────────────────────────────────────
echo "🚀  Starting Spring Boot backend..."
cd "$ROOT_DIR/backend"
NEON_JDBC_URL="$NEON_JDBC_URL" \
NEON_USERNAME="$NEON_USERNAME" \
NEON_PASSWORD="$NEON_PASSWORD" \
JWT_SECRET="$JWT_SECRET" \
./gradlew bootRun --no-daemon > "$LOG_BACKEND" 2>&1 &
BACKEND_PID=$!
echo "   PID: $BACKEND_PID  |  Logs: $LOG_BACKEND"

# ── Wait for Spring Boot to be ready ─────────────────────────
echo "⏳  Waiting for Spring Boot to start (up to 60s)..."
for i in $(seq 1 60); do
  if curl -sf http://localhost:8080/api/profiles > /dev/null 2>&1; then
    echo "✅  Backend ready!"
    break
  fi
  if [[ $i -eq 60 ]]; then
    echo "❌  Backend did not start in time. Check logs: $LOG_BACKEND"
    exit 1
  fi
  sleep 1
done

# ── Start Cloudflare Tunnel ───────────────────────────────────
echo "🌐  Starting Cloudflare Tunnel..."
cloudflared tunnel --url http://localhost:8080 > "$LOG_TUNNEL" 2>&1 &
sleep 8

TUNNEL_URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' "$LOG_TUNNEL" | head -1)

if [[ -z "$TUNNEL_URL" ]]; then
  echo "❌  Could not get tunnel URL. Check: $LOG_TUNNEL"
  exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅  Tunnel URL: $TUNNEL_URL"
echo "═══════════════════════════════════════════════════════"
echo ""

# ── Update Vercel API_URL ─────────────────────────────────────
if command -v vercel &> /dev/null; then
  echo "🔄  Updating Vercel API_URL..."
  cd "$ROOT_DIR/frontend"
  vercel link --yes > /dev/null 2>&1 || true
  vercel env rm API_URL production --yes > /dev/null 2>&1 || true
  echo "$TUNNEL_URL" | vercel env add API_URL production > /dev/null 2>&1
  echo "✅  Vercel API_URL updated. Redeploying..."
  vercel --prod > /tmp/vercel-deploy.log 2>&1 &
  echo "   Deploy running in background. Check: /tmp/vercel-deploy.log"
fi

echo ""
echo "⚠️   NOTE: This tunnel only works while your computer is ON."
echo "    For a permanent solution, deploy to Render.com:"
echo "    https://render.com → New Web Service → connect GitHub repo"
echo ""
echo "Press Ctrl+C to stop the backend and tunnel."
wait

