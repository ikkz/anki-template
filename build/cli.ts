#!/usr/bin/env node
import { type BuildConfig, configs } from './config.ts';
import { rollupOptions } from './rollup.ts';
import { configMatch } from './utils.ts';
import { parseArgs } from 'node:util';
import { rollup } from 'rollup';
import { watch } from 'rollup';

const { values: args } = parseArgs({
  options: {
    entry: {
      type: 'string',
    },
    locale: {
      type: 'string',
    },
    field: {
      type: 'string',
    },
    dev: {
      type: 'boolean',
      default: false,
    },
    e2e: {
      type: 'boolean',
      default: false,
    },
  },
});

const argConfig: Partial<Pick<BuildConfig, 'entry' | 'locale' | 'field'>> = {
  entry: (args.entry as BuildConfig['entry']) || 'basic',
  locale: (args.locale as BuildConfig['locale']) || 'en',
  field: (args.field as BuildConfig['field']) || 'native',
};

if (!args.dev) {
  for (const config of configs.filter((config) =>
    configMatch(argConfig, config),
  )) {
    console.log('build', config);
    const { inputOptions, outputOptions } = await rollupOptions(config, {
      dev: false,
      e2e: args.e2e ?? false,
    });
    const bundle = await rollup(inputOptions);
    bundle.write(outputOptions);
    bundle.close();
  }
} else {
  const { inputOptions, outputOptions } = await rollupOptions(
    {
      entry: argConfig.entry || 'basic',
      locale: argConfig.locale || 'en',
      field: argConfig.field || 'native',
      name: 'dev',
      type_id: 0,
      deck_id: 0,
    },
    {
      e2e: true,
      dev: true,
    },
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
