import path from 'node:path';
import { spawn } from 'node:child_process';

const BIN = path.resolve(import.meta.dirname, 'anki-eco-packager');

// Get command line arguments (excluding node and script path)
const args = process.argv.slice(2);

// Spawn the Python process
const pythonProcess = spawn(BIN, ['--cwd', process.cwd(), ...args], {
  stdio: 'inherit',
  cwd: process.cwd(),
  shell: true,
});

// Handle process exit
pythonProcess.on('close', (code) => {
  process.exit(code);
});

pythonProcess.on('error', (err) => {
  console.error('Failed to start Python process:', err);
  process.exit(1);
});
