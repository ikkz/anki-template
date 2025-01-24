import memoize from 'lodash-es/memoize.js';
import fs from 'node:fs/promises';
import path from 'node:path';

export const readTemplate = memoize(async (name: string) => {
  const folder = path.resolve(import.meta.dirname, '../dist', name);
  const front = await readString(path.join(folder, 'front.html'));
  const back = await readString(path.join(folder, 'back.html'));
  return { front, back };
});

export const readString = (path: string) =>
  fs.readFile(path, {
    encoding: 'utf8',
  });
