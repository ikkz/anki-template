export interface TfItem {
  node: HTMLDivElement;
  answer: boolean;
}

export function extractTfItems(field: HTMLElement): TfItem[] {
  if (!field) {
    return [];
  }
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
