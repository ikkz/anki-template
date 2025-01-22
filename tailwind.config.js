/* eslint-disable @typescript-eslint/no-require-imports */
import en from './translations/en.json';
import ja from './translations/ja.json';
import zh from './translations/zh.json';

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
    'ABCDEFGHIJ'.split('').map((alpha) => `before:content-['${alpha}']`),
    ['missedAnswer', 'correctAnswer', 'wrongAnswer']
      .map((key) => [zh, en, ja].map((map) => `after:content-['${map[key]}']`))
      .flat(),
  ].flat(),
};
