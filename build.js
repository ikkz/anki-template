import packageJson from './package.json' with { type: 'json' };
import { visualizer } from 'rollup-plugin-visualizer';
import templates from './templates.json' with { type: 'json' };
import release from './release.json' with { type: 'json' };
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import cssnano from 'cssnano';
import alias from '@rollup/plugin-alias';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import url from '@rollup/plugin-url';
import virtual from '@rollup/plugin-virtual';
import { dataToEsm } from '@rollup/pluginutils';
import postcss from 'rollup-plugin-postcss';
import { swc } from 'rollup-plugin-swc3';
import { resolve, extname } from 'node:path';
import fs from 'node:fs/promises';

export async function rollupOptions(config) {
  async function buildInputOptions() {
    /** @type {import('rollup').InputOptions} */
    return {
      input: 'entry',
      plugins: [
        virtual({
          'at/options': dataToEsm(templates[config.id]),
          'at/locale': dataToEsm({
            map: JSON.parse(
              await fs.readFile(`./src/locales/${config.locale}.json`, {
                encoding: 'utf-8',
              }),
            ),
            locale: config.locale,
          }),
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
              replacement: resolve(
                import.meta.dirname,
                'src/polyfills/is-plain-object',
              ),
            },
            { find: '@', replacement: resolve(import.meta.dirname, 'src') },
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
        visualizer(),
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
            }),
          false,
        ),
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
        {
          name: 'generate-template',
          generateBundle(_, bundle) {
            Object.keys(bundle)
              .filter((fileName) => extname(fileName) !== '.html')
              .forEach((fileName) => {
                delete bundle[fileName];
              });
            this.emitFile({
              type: 'asset',
              fileName: `style.css`,
              source: ``,
            });
            this.emitFile({
              type: 'asset',
              fileName: `back.html`,
              source: `<div id="at-back-indicator"></div>{{FrontSide}}`,
            });
          },
        },
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

function ensureValue(value) {
  return typeof value === 'function' ? value() : value;
}
