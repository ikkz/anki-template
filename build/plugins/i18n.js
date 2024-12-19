import fs from 'node:fs/promises';
import path from 'node:path';

export default (locale) => {
  const map = fs
    .readFile(
      path.resolve(import.meta.dirname, '../../locales/', `${locale}.json`),
      { encoding: 'utf8' },
    )
    .then(JSON.parse);
  return {
    resolveId(id) {
      if (id.startsWith('at/i18n/')) {
        return id;
      }
      return null;
    },
    async load(id) {
      if (id.startsWith('at/i18n/')) {
        const key = id.replace(/at\/i18n\/(.+)/, '$1');
        const value = (await map)[key];
        if (!value) {
          throw new Error('i18n key not found');
        }
        return `export default ${JSON.stringify(value)}`;
      }
    },
  };
};
