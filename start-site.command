#!/bin/bash

set -e

cd "$(dirname "$0")"

echo "Stopping old local site processes on port 5173..."
lsof -ti tcp:5173 | xargs kill -9 2>/dev/null || true

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting wedding invite at http://127.0.0.1:5173"
if command -v open >/dev/null 2>&1; then
  open "http://127.0.0.1:5173"
fi

npm run dev -- --port 5173
