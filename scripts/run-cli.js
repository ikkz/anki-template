#!/usr/bin/env node
import { execSync } from 'child_process';

const nodeVersion = process.version;
const requiredVersion = '23.6.0';

// Simple version comparison function
function compareVersions(version1, version2) {
  const v1parts = version1.replace('v', '').split('.').map(Number);
  const v2parts = version2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;

    if (v1part > v2part) return 1;
    if (v1part < v2part) return -1;
  }
  return 0;
}

// Get the CLI arguments excluding node and script name
const cliArgs = process.argv.slice(2);
const cliArgsString = cliArgs.join(' ');

// Check if we have a supported Node.js version for native TypeScript
if (compareVersions(nodeVersion, requiredVersion) >= 0) {
  // Use native Node.js TypeScript support
  const command = `node --max-old-space-size=4096 build/cli.ts ${cliArgsString}`;
  console.log(`Using native Node.js TypeScript support (${nodeVersion})`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    process.exit(error.status || 1);
  }
} else {
  // Use tsx as fallback
  const command = `npx tsx --max-old-space-size=4096 build/cli.ts ${cliArgsString}`;
  console.log(
    `Using tsx fallback for Node.js ${nodeVersion} (requires v${requiredVersion}+)`,
  );
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    process.exit(error.status || 1);
  }
}
