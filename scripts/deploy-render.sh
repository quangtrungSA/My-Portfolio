#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# deploy-render.sh  –  Deploy backend to Render.com via API
#
# Usage:
#   export RENDER_API_KEY=rnd_xxxxxxxxxxxx   # from render.com/dashboard → Account Settings → API Keys
#   export RENDER_SERVICE_ID=srv_xxxxxxxxxxxx # from your Render service URL
#   ./scripts/deploy-render.sh
#
# First time (no service exists yet): follow the manual step below.
# ─────────────────────────────────────────────────────────────────

set -e

RENDER_API_KEY=${RENDER_API_KEY:-""}
RENDER_SERVICE_ID=${RENDER_SERVICE_ID:-""}

if [[ -z "$RENDER_API_KEY" ]]; then
  echo "❌  RENDER_API_KEY is not set."
  echo "   Get it at: https://dashboard.render.com/u/settings#api-keys"
  exit 1
fi

if [[ -z "$RENDER_SERVICE_ID" ]]; then
  echo "❌  RENDER_SERVICE_ID is not set."
  echo "   Find it in your Render service URL: https://dashboard.render.com/web/srv_XXXXXXXX"
  exit 1
fi

echo "🚀  Triggering deploy for service: $RENDER_SERVICE_ID"

RESPONSE=$(curl -s -X POST \
  "https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys" \
  -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"clearCache": false}')

DEPLOY_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || echo "")

if [[ -z "$DEPLOY_ID" ]]; then
  echo "❌  Deploy failed. Response:"
  echo "$RESPONSE"
  exit 1
fi

echo "✅  Deploy triggered! ID: $DEPLOY_ID"
echo "🔍  Track progress at: https://dashboard.render.com/web/${RENDER_SERVICE_ID}/deploys/${DEPLOY_ID}"

