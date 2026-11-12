#!/usr/bin/env bash
# Start the AttachTrack dev server in the hosted sandbox.
#
# The sandbox is recycled between sessions: node_modules disappears and any
# previous dev server dies. This script reinstalls only when needed and then
# starts Vite, printing the live preview URL for the current sandbox.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -x node_modules/.bin/vite ]; then
  echo "Dependencies missing, installing..."
  npm install --silent
fi

PORT="${PORT:-5173}"

if [ -n "${E2B_SANDBOX_ID:-}" ]; then
  echo "Preview: https://${PORT}-${E2B_SANDBOX_ID}.e2b.app/"
fi

# strictPort: fail loudly instead of silently moving to another port, because
# the preview URL is derived from the port number.
exec npx vite --host 0.0.0.0 --port "$PORT" --strictPort
