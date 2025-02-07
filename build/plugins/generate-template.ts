import type { BuildConfig } from '../config.ts';
import { entries, type Note } from '../entries.ts';
import { findMatchNote } from '../utils.ts';
import * as R from 'remeda';
import type { Plugin } from 'rollup';

export const BUILTIN_FIELDS = [
  'Tags',
  'Type',
  'Deck',
  'Subdeck',
  'CardFlag',
  'Card',
  'FrontSide',
] as const;

export interface BuildJson {
  config: BuildConfig;
  notes: Note<string>[];
  fields: string[];
}

export default (config: BuildConfig) =>
  ({
    name: 'generate-template',
    generateBundle(_, bundle) {
      Object.keys(bundle)
        .filter((fileName) => fileName.split('.').pop() !== 'html')
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
        source: JSON.stringify({
          config,
          notes: findMatchNote(config),
          fields: R.difference(entries[config.entry].fields, BUILTIN_FIELDS),
        }),
      });
    },
  }) as Plugin;
