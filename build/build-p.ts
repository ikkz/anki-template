#!/usr/bin/env node
import { items } from './config.ts';
import { spawn } from 'node:child_process';

const entries = items[0].variants;

entries.forEach((entry) => {
  const child = spawn('pnpm', ['build', `--entry=${entry}`], {
    stdio: 'inherit',
  });
  child.on('close', (code) => {
    if (code !== 0) {
      process.exit(code);
    }
  });
});
