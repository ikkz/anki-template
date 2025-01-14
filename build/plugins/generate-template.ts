import type { BuildConfig } from '../config.ts';
import { extname } from 'node:path';
import type { Plugin } from 'rollup';

export default (config: BuildConfig) =>
  ({
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
      this.emitFile({
        type: 'asset',
        fileName: 'build.json',
        source: JSON.stringify(config),
      });
    },
  }) as Plugin;
