#!/bin/bash
set -e

echo "=== Installing dependencies ==="
npm install

echo "=== Checking vite installation ==="
npm list vite || echo "Vite not found in npm list"
ls -la node_modules/.bin/vite || echo "Vite binary not found"

echo "=== Building frontend ==="
if [ -f "node_modules/.bin/vite" ]; then
    echo "Using local vite binary"
    ./node_modules/.bin/vite build
elif command -v npx >/dev/null 2>&1; then
    echo "Using npx vite"
    npx vite build
else
    echo "No vite found, trying direct node execution"
    node ./node_modules/vite/bin/vite.js build
fi

echo "=== Building backend ==="
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "=== Build completed ==="
ls -la dist/