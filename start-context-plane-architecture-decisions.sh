#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/app"

echo "=== Context Plane Architecture Decisions ==="
echo "Installing dependencies..."
npm install --silent 2>/dev/null || npm install

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  Context Plane Architecture Decisions — local-only"
echo "  Listening on http://127.0.0.1:5125"
echo "  Do NOT expose this port to a LAN or the internet."
echo "════════════════════════════════════════════════════════════"
echo ""

npm run dev -- --port 5125 --host 127.0.0.1
