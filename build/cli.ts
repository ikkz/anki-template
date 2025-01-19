#!/usr/bin/env node
import { type BuildConfig, configs } from './config.ts';
import { entries } from './entries.ts';
import { rollupOptions } from './rollup.ts';
import { parseArgs } from 'node:util';
import { rollup } from 'rollup';
import { watch } from 'rollup';

const { values: args } = parseArgs({
  options: {
    dev: {
      type: 'string',
    },
    locale: {
      type: 'string',
      default: 'en',
    },
    field: {
      type: 'string',
      default: 'markdown',
    },
  },
});

if (!args.dev) {
  for (const config of configs) {
    console.log('build', config);
    const { inputOptions, outputOptions } = await rollupOptions(config);
    const bundle = await rollup(inputOptions);
    bundle.write(outputOptions);
    bundle.close();
  }
} else {
  const { inputOptions, outputOptions } = await rollupOptions(
    {
      entry: args.dev as keyof typeof entries,
      locale: args.locale || 'en',
      name: 'dev',
      field: (args.field as BuildConfig['field']) || 'markdown',
      type_id: 0,
      deck_id: 0,
    },
    true,
  );
  const watcher = watch({
    ...inputOptions,
    output: outputOptions,
    watch: {
      buildDelay: 1000,
      clearScreen: false,
      exclude: ['node_modules/**', 'dist/**'],
    },
  });
  watcher.on('event', (event) => {
    if (event.code === 'BUNDLE_END') {
      event.result.close();
    } else if (event.code === 'ERROR') {
      console.log(event.error);
      event.result?.close();
    }
  });
}
