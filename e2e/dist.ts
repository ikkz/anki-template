import { type BuildConfig } from '../build/config';
import { type BuildJson } from '../build/plugins/generate-template';
import { readString } from './utils';
import fs from 'node:fs/promises';
import path from 'node:path';

const folder = path.resolve(import.meta.dirname, '../dist');

const builds = await Promise.all(
  (await fs.readdir(folder)).map(
    async (name) =>
      JSON.parse(
        await readString(path.resolve(folder, name, 'build.json')),
      ) as BuildJson,
  ),
);

export const filterBuilds = (pattern: Partial<BuildConfig>) =>
  builds.filter(({ config }) =>
    Object.entries(pattern).every(
      ([k, v]) => config[k as keyof BuildConfig] === v,
    ),
  );
