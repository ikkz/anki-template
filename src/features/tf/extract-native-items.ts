import { type TfItem } from '.';
import { DomRenderer } from '@/components/dom-renderer';
import { createElement } from 'react';

function isBrNode(node?: Node | null): node is HTMLBRElement {
  return node?.nodeType === Node.ELEMENT_NODE && node.nodeName === 'BR';
}

export interface NativeItem {
  node: HTMLDivElement;
  answer: boolean;
}

export function extractTfItems(field: HTMLElement): NativeItem[] {
  if (!field) {
    return [];
  }
  const textContent = field.textContent?.trim();
  if (!textContent) {
    return [];
  }
  if (!/^[TF]={3,}/.test(textContent)) {
    return extractTfItemsLegacy(field);
  }

  const items: NativeItem[] = [];
  const childNodes = Array.from(field.childNodes);
  for (const node of childNodes) {
    const childText = node.textContent || '';
    const match = childText.match(/^(T|F)={3,}/);
    const last = items[items.length - 1];
    if (match) {
      items.push({
        answer: match[1] === 'T',
        node: document.createElement('div'),
      });
      if (last) {
        while (isBrNode(last.node.lastChild)) {
          last.node.lastChild.remove();
        }
      }
    } else {
      if (last && !(last.node.childNodes.length === 0 && isBrNode(node))) {
        last.node.appendChild(node);
      }
    }
  }
  return items;
}

export function extractTfItemsLegacy(field: HTMLElement): NativeItem[] {
  const itemNodes = field.querySelector('ul')?.querySelectorAll(':scope > li');
  if (!itemNodes?.length) {
    return [];
  }
  return Array.from(itemNodes).map((node) => {
    const answer = !node.textContent?.startsWith('F:');
    const container = document.createElement('div');
    container.append(...Array.from(node.childNodes));

    let firstTextNode: Node | null = container;
    while (firstTextNode && firstTextNode.nodeType !== Node.TEXT_NODE) {
      firstTextNode = firstTextNode.firstChild;
    }
    do {
      if (!firstTextNode) {
        break;
      }
      const match = firstTextNode.textContent?.match(/^(T|F):\s*/);
      if (!match) {
        container.prepend('[T/F not found] ');
        break;
      }
      const range = document.createRange();
      range.setStart(firstTextNode, 0);
      range.setEnd(firstTextNode, match[0].length);
      range.deleteContents();
      // eslint-disable-next-line no-constant-condition
    } while (false);

    return { answer, node: container };
  });
}

export function extractItems(field: HTMLElement): TfItem[] {
  return extractTfItems(field).map(({ node, answer }) => ({
    answer,
    node: createElement(DomRenderer, { dom: node }),
  }));
}
