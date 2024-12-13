/* eslint-disable @typescript-eslint/no-require-imports */
import en from './src/locales/en.json';
import zh from './src/locales/zh.json';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) {&}',
      '&.night-mode',
      '.night-mode &',
    ],
  ],
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
  safelist: [
    'ABCDEF'.split('').map((alpha) => `before:content-['${alpha}']`),
    ['missedAnswer', 'correctAnswer', 'wrongAnswer']
      .map((key) => [zh, en].map((map) => `after:content-['${map[key]}']`))
      .flat(),
  ].flat(),
};
