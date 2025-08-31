import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    dir: 'tests/',
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      react: 'preact/compat',
    },
  },
});
