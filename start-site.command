#!/bin/bash

set -e

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed."
  if command -v brew >/dev/null 2>&1; then
    echo "Installing Node.js via Homebrew..."
    brew install node
  else
    echo "Please install Node.js LTS from https://nodejs.org/"
    if command -v open >/dev/null 2>&1; then
      open "https://nodejs.org/"
    fi
    read -r -p "After installing Node.js, run this file again. Press Enter to close."
    exit 1
  fi
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not available. Please reinstall Node.js LTS from https://nodejs.org/"
  if command -v open >/dev/null 2>&1; then
    open "https://nodejs.org/"
  fi
  read -r -p "After installing Node.js, run this file again. Press Enter to close."
  exit 1
fi

echo "Stopping old local site processes on port 5173..."
lsof -ti tcp:5173 | xargs kill -9 2>/dev/null || true

echo "Installing or updating project dependencies..."
npm install

echo "Starting wedding invite at http://127.0.0.1:5173"
if command -v open >/dev/null 2>&1; then
  open "http://127.0.0.1:5173"
fi

npm run dev -- --port 5173
