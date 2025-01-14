import type { BuildConfig } from './config.ts';
import devServer from './plugins/dev-server/index.ts';
import generateTemplate from './plugins/generate-template.ts';
import { readJson, ensureValue } from './utils.ts';
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
import type {
  InputOptions,
  OutputAsset,
  OutputChunk,
  OutputOptions,
} from 'rollup';
import postcss from 'rollup-plugin-postcss';
import { swc } from 'rollup-plugin-swc3';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from 'tailwindcss';

const packageJson = await readJson('./package.json');
const entries = await readJson('./build/entries.json');

export async function rollupOptions(config: BuildConfig, dev?: boolean) {
  const id = `${config.entry}_${config.locale}`;
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
    return {
      input: 'entry',
      plugins: [
        virtual({
          'at/options': dataToEsm({
            ...entries[config.entry],
            ...config,
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
          }) as any,
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
              syntax: 'typescript',
            },
            transform: {
              react: {
                pragma: 'h',
                pragmaFrag: 'Fragment',
                importSource: 'preact',
                runtime: 'automatic',
              },
            },
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
        html({
          fileName: `front.html`,
          template(options) {
            const { files = {} } = options || {};
            let frontHtml = '';
            frontHtml += `<script>
window.atDefaultOptions =

/* options begin */
{
	"at:test:test": "test"
}
/* options end */

</script>
`;
            frontHtml += `<div data-at-version="${packageJson.version}" id="at-root"></div>`;
            frontHtml += `<style>${(files?.css as OutputAsset[])?.map(({ source }) => source).join('')}</style>`;
            frontHtml += `
<div id="at-fields" style="display:none;">
${buildFields()}
</div>
`;
            frontHtml +=
              (files.js as OutputChunk[])
                ?.map(({ code }) => `<script>${code}</script>`)
                .join('') || '';
            return frontHtml;
          },
        }),
        generateTemplate(config),
        envValue(false, () => devServer()),
      ],
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    } as InputOptions;
  }
  function buildOutputOptions() {
    return {
      format: 'iife',
      dir: `dist/${id}`,
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
    } as OutputOptions;
  }

  return {
    inputOptions: await buildInputOptions(),
    outputOptions: buildOutputOptions(),
  };

  function envValue<P, D>(prodValue: P, devValue: D) {
    return dev ? ensureValue(devValue) : ensureValue(prodValue);
  }

  function buildFields() {
    const options = entries[config.entry];
    return options.fields
      .map(
        (field: string) =>
          `    <div id="at-field-${field}">${envValue(
            `{{${field}}}`,
            entries[config.entry].notes[0].fields[field] || '',
          )}</div>`,
      )
      .join('\n');
  }

  function buildEntry() {
    return `${envValue('', 'import "preact/debug";')}
  import App from '@/entries/${config.entry}.tsx';
  import { setup } from '@/entries';
  setup(App);`;
  }
}
