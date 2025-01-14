declare module 'at/options' {
  export const fields: string[];
  export const entry: string;
  export const locale: 'en' | 'zh';
}

declare module 'at/i18n' {
  const i18nMap: typeof import('../translations/en.json') &
    typeof import('../translations/zh.json');
  export = i18nMap;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '@/BUILD_ENTRY.tsx' {}
