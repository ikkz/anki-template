import { Tool } from '@/store/tools';

export function getUrl(tool: Tool, text: string) {
  const { url, prefixText, suffixText } = tool;
  let q = '';
  if (prefixText) {
    q = prefixText;
  }
  q += text;
  if (suffixText) {
    q += suffixText;
  }
  q = encodeURIComponent(q);
  return url?.replace('{q}', q);
}
