#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  console.log('Building frontend with Vite...');
  
  // Try different ways to run vite
  const viteCommands = [
    'npx vite build',
    'node node_modules/vite/bin/vite.js build',
    './node_modules/.bin/vite build'
  ];
  
  let viteBuildSuccess = false;
  
  for (const cmd of viteCommands) {
    try {
      console.log(`Trying: ${cmd}`);
      execSync(cmd, { 
        stdio: 'inherit',
        cwd: __dirname
      });
      viteBuildSuccess = true;
      break;
    } catch (error) {
      console.log(`Failed: ${cmd}`);
      continue;
    }
  }
  
  if (!viteBuildSuccess) {
    throw new Error('All vite build attempts failed');
  }
  
  console.log('Building backend with esbuild...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  console.log('Build completed successfully!');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}