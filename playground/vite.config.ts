import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import path from 'node:path';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import { Mode, plugin as md } from 'vite-plugin-markdown';
import pages from 'vite-plugin-pages';

export default defineConfig({
  root: import.meta.dirname,
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        tailwindcss(path.resolve(import.meta.dirname, './tailwind.config.js')),
      ],
    },
  },
  plugins: [react(), pages(), md({ mode: [Mode.HTML] })],
});
