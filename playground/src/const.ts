import { items } from '../../build/config';
import { entries } from '../../build/entries';

const findConfig = (key: string) =>
  items.find((config) => config.key === key)?.variants;

export const entryOptions = findConfig('entry')!.map((entry) => ({
  value: entry,
  label: entries[entry as keyof typeof entries].desc,
}));
export const localeList = findConfig('locale')!;

export const fieldOptions = [
  { value: 'native', label: 'The native Anki field' },
  { value: 'markdown', label: 'With markdown support, but larger size' },
];
