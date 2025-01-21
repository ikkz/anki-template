import type { BuildConfig } from './config.ts';
import { entries } from './entries.ts';
import devServer from './plugins/dev-server/index.ts';
import generateTemplate from './plugins/generate-template.ts';
import { readJson, ensureValue, findMatchNote } from './utils.ts';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
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
import nodePolyfills from 'rollup-plugin-polyfill-node';
import postcss from 'rollup-plugin-postcss';
import { swc, minify } from 'rollup-plugin-swc3';
// import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from 'tailwindcss';

const packageJson = await readJson('./package.json');

export async function rollupOptions(config: BuildConfig, dev?: boolean) {
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
          'at/virtual/field': `export {default as AnkiField} from '${path.resolve(import.meta.dirname, config.field === 'markdown' ? '../src/features/markdown/field.tsx' : '../src/components/native-field.tsx')}'`,
          'at/virtual/extract-tf-items': `export {extractItems} from '${path.resolve(import.meta.dirname, config.field === 'markdown' ? '../src/features/tf/extract-markdown-items.ts' : '../src/features/tf/extract-native-items.ts')}'`,
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
          ].filter(Boolean),
        }),
        nodeResolve({
          extensions: ['.mjs', '.js', '.json', '.ts', '.tsx'],
        }),
        commonjs(),
        nodePolyfills(),
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
            minify: {
              compress: true,
            },
          },
          minify: true,
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
        // visualizer(),
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
                ?.map(
                  ({ code }) =>
                    `<script>
                      (function(){
                        const code="${Buffer.from(code).toString('base64')}";
                        function decodeBase64(encodedStr) {
                          const bytes = Uint8Array.from(atob(encodedStr), c => c.charCodeAt(0));
                          return new TextDecoder().decode(bytes);
                        }
                        eval(decodeBase64(code));
                      })();
                    </script>`,
                )
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
      dir: `dist/${config.name}`,
      inlineDynamicImports: true,
      plugins: [
        envValue(
          minify({
            compress: {
              drop_console: true,
            },
            format: {
              comments: false,
            },
          }),
          null,
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
    const entry = entries[config.entry];
    const notes = findMatchNote(config);
    return entry.fields
      .map(
        (field: string) =>
          `    <div id="at-field-${field}">${envValue(
            `{{${field}}}`,
            notes[0].fields[field as never] || '',
          )}</div>`,
      )
      .join('\n');
  }

  function buildEntry() {
    return `${envValue('', 'import "preact/debug";')}
  import App from '@/entries/${config.entry.split('_')[0]}.tsx';
  import { setup } from '@/entries';
  setup(App);`;
  }
}
