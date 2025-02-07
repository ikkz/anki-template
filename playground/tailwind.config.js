import typography from '@tailwindcss/typography';
import path from 'node:path';

const resolve = (relative) => path.resolve(import.meta.dirname, relative);

/** @type {import('tailwindcss').Config} */
export default {
  content: [resolve('./index.html'), resolve('./src/**/*.{js,ts,jsx,tsx}')],
  theme: {
    extend: {},
  },
  plugins: [typography()],
};
