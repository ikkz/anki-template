import { type TfItem } from '.';
import { domToMd } from '../markdown/dom-to-md';
import { Markdown } from '../markdown/renderer';
import { createElement } from 'react';

export function extractItems(field: HTMLElement): TfItem[] {
  const lines = domToMd(field).split('\n');
  const items: { lines: string[]; answer: boolean }[] = [];
  for (const line of lines) {
    const match = line.match(/^(T|F)={3,}/);
    const last = items[items.length - 1];
    if (match) {
      items.push({
        answer: match[1] === 'T',
        lines: [],
      });
      if (last) {
        while (last.lines[last.lines.length - 1] === '\n') {
          last.lines.pop();
        }
      }
    } else {
      if (last && !(last.lines.length === 0 && line === '\n')) {
        last.lines.push(line);
      }
    }
  }
  return items.map(({ answer, lines }) => ({
    answer,
    node: createElement(Markdown, {
      value: lines.join('\n'),
      className: 'rm-prose-y',
    }),
  }));
}
