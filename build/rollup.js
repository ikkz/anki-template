import devServer from './plugins/dev-server/index.js';
import generateTemplate from './plugins/generate-template.js';
import { readJson, ensureValue } from './utils.js';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import virtual from '@rollup/plugin-virtual';
import { dataToEsm } from '@rollup/pluginutils';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import fs from 'node:fs/promises';
import path from 'node:path';
import postcss from 'rollup-plugin-postcss';
import { swc } from 'rollup-plugin-swc3';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from 'tailwindcss';

const packageJson = await readJson('./package.json');
const templates = await readJson('./templates.json');
const release = await readJson('./release.json');

export async function rollupOptions(config) {
  async function buildInputOptions() {
    const i18nMap = await fs
      .readFile(
        path.resolve(
          import.meta.dirname,
          '../translations/',
          `${config.locale}.json`,
        ),
        { encoding: 'utf8' },
      )
      .then(JSON.parse);
    /** @type {import('rollup').InputOptions} */
    return {
      input: 'entry',
      plugins: [
        virtual({
          'at/options': dataToEsm({
            ...templates[config.id],
            locale: config.locale,
          }),
          'at/i18n': dataToEsm(i18nMap),
          entry: buildEntry(),
        }),
        replace({
          'process.env.NODE_ENV': JSON.stringify(
            envValue('production', 'development'),
          ),
          preventAssignment: true,
        }),
        json(),
        alias({
          entries: [
            {
              find: 'lodash/isPlainObject',
              replacement: path.resolve(
                import.meta.dirname,
                '../src/polyfills/is-plain-object',
              ),
            },
            {
              find: '@',
              replacement: path.resolve(import.meta.dirname, '../src'),
            },
            { find: 'react', replacement: 'preact/compat' },
            { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
            { find: 'react-dom', replacement: 'preact/compat' },
            { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
          ],
          customResolver: nodeResolve({
            extensions: ['.mjs', '.js', '.json', '.ts', '.tsx'],
          }),
        }),
        nodeResolve({
          extensions: ['.mjs', '.js', '.json', '.ts', '.tsx'],
        }),
        commonjs(),
        swc({
          jsc: {
            target: 'es5',
            parser: {
              tsx: true,
            },
            transform: {
              react: {
                pragma: 'h',
                pragmaFrag: 'Fragment',
                importSource: 'preact',
                runtime: 'automatic',
              },
            },
            minify: false,
          },
        }),
        postcss({
          extract: true,
          plugins: [
            autoprefixer(),
            tailwindcss(),
            envValue(
              cssnano({
                preset: [
                  'default',
                  {
                    discardComments: {
                      removeAll: true,
                    },
                  },
                ],
              }),
              false,
            ),
          ].filter(Boolean),
        }),
        url(),
        visualizer({
          emitFile: true,
        }),
        html({
          fileName: `front.html`,
          template({ files }) {
            let frontHtml = '';
            frontHtml += `<div data-at-version="${packageJson.version}" id="at-root"></div>`;
            frontHtml += `<style>${files?.css?.map(({ source }) => source).join('')}</style>`;
            frontHtml += `
<div id="at-fields" style="display:none;">
${buildFields()}
</div>
`;
            frontHtml +=
              files.js
                ?.map(({ code }) => `<script>${code}</script>`)
                .join('') || '';
            return frontHtml;
          },
        }),
        generateTemplate(),
        envValue(false, () => devServer()),
      ],
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    };
  }
  /** @return {import('rollup').OutputOptions} */
  function buildOutputOptions() {
    return {
      format: 'iife',
      dir: `dist/${config.id}/${config.locale}`,
      plugins: [
        envValue(
          () =>
            terser({
              compress: {
                drop_console: true,
              },
              format: {
                comments: false,
              },
            }),
          false,
        ),
      ],
    };
  }

  return {
    inputOptions: await buildInputOptions(),
    outputOptions: buildOutputOptions(),
  };

  function envValue(prodValue, devValue) {
    return config.dev ? ensureValue(devValue) : ensureValue(prodValue);
  }

  function buildFields() {
    const options = templates[config.id];
    return options.fields
      .map(
        (field) =>
          `    <div id="at-field-${field}">${envValue(
            `{{${field}}}`,
            release[config.id].notes[0].fields[field] || '',
          )}</div>`,
      )
      .join('\n');
  }

  function buildEntry() {
    return `${envValue('', 'import "preact/debug";')}
  import App from '@/entries/${config.id}.tsx';
  import { setup } from '@/entries';
  setup(App);`;
  }
}
