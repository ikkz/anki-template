import type { BuildConfig } from './config';
import { entries } from './entries.ts';
import fs from 'node:fs/promises';

export function ensureValue<T>(value: T): T extends () => infer R ? R : T {
  return typeof value === 'function' ? value() : value;
}

export async function readJson(path: string) {
  return JSON.parse(
    await fs.readFile(path, {
      encoding: 'utf-8',
    }),
  );
}

export function configMatch(
  pattern: Partial<BuildConfig>,
  config: BuildConfig,
) {
  return Object.entries(pattern)
    .filter(([, v]) => !!v)
    .every(([k, v]) => config[k as keyof BuildConfig] === v);
}

export function findMatchNote(config: BuildConfig) {
  const notes = entries[config.entry].notes;
  return notes.filter(({ config: noteConfig }: { config: any }) =>
    configMatch(noteConfig, config),
  );
}
