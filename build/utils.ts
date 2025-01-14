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
