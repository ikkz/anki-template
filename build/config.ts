export interface BuildConfig {
  id: number;
  name: string;
  locale: string;
  entry: string;
  fieldExtension: string;
}

interface ConfigItem {
  key: keyof BuildConfig;
  len: number;
  variants: string[];
}

const items: ConfigItem[] = [
  {
    key: 'entry',
    len: 4,
    variants: ['mcq', 'tf', 'basic'],
  },
  {
    key: 'locale',
    len: 4,
    variants: ['zh', 'en'],
  },
  // field extension
];

const configs: BuildConfig[] = [];

function extendVariant(
  index: number,
  base: number,
  config: Pick<BuildConfig, 'id'> & Partial<BuildConfig>,
) {
  if (index === items.length) {
    configs.push({
      ...config,
    } as BuildConfig);
    return;
  }
  const { variants, len, key } = items[index];
  variants.forEach((value, i) => {
    extendVariant(index + 1, base + len, {
      ...config,
      [key]: value,
      name: config.name ? `${config.name}.${value}` : value,
      id: config.id | (i << base),
    });
  });
}

extendVariant(0, 0, { id: 0x101 << 28 });

export { configs };
