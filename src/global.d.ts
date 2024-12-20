declare module 'at/options' {
  export const fields: string[];
  export const id: string;
}

declare module 'at/locale' {
  export const locale: 'en' | 'zh';
}

declare module 'at/i18n';

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '@/BUILD_ENTRY.tsx' {}
