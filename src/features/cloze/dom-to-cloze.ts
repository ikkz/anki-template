const UNIT_START = '{{';
const UNIT_END = '}}';

function insertAfter(node: Node, toInsert: Node) {
  const parent = node.parentNode;
  const next = node.nextSibling;
  if (!parent) {
    return;
  }
  if (next) {
    parent.insertBefore(toInsert, next);
  } else {
    parent.appendChild(toInsert);
  }
}

export const CLOZE_CLASS = 'at-cloze-unit';
export const CLOZE_ANSWER_ATTR = 'data-at-cloze-answer';
export const CLOZE_INDEX_ATTR = 'data-at-cloze-unit';

function tagUnit(node: Element, index: number) {
  node.classList.add(CLOZE_CLASS);
  node.setAttribute(CLOZE_INDEX_ATTR, String(index));
  switch (node.tagName) {
    case 'SPAN': {
      node.setAttribute(CLOZE_ANSWER_ATTR, node.textContent || '');
      break;
    }
    case 'IMG': {
      node.setAttribute(CLOZE_ANSWER_ATTR, node.getAttribute('src') || '');
    }
  }
}

function createUnit(content: string, index: number) {
  const text = document.createTextNode(content);
  const span = document.createElement('span');
  span.appendChild(text);
  if (content) {
    tagUnit(span, index);
  }
  return span;
}

export function domToCloze(container: HTMLElement): number {
  let unitIndex = 0;
  let inUnit = false;

  function traverseNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      const content = node.textContent;
      const parent = node.parentNode;
      if (!parent) {
        return;
      }
      const startIndex = content.indexOf(UNIT_START);
      const endIndex = content.indexOf(UNIT_END);
      const hasStart = startIndex >= 0;
      const hasEnd = endIndex >= 0;
      if (inUnit && !hasStart && !hasEnd) {
        const unit = createUnit(content, unitIndex);
        node.parentNode?.replaceChild(unit, node);
        return;
      }

      if (inUnit && hasEnd) {
        const unit = createUnit(content.slice(0, endIndex), unitIndex++);
        node.parentNode?.insertBefore(unit, node);
        inUnit = false;
        node.textContent = content.slice(endIndex + UNIT_END.length);
        traverseNode(node);
      } else if (!inUnit && hasStart) {
        node.textContent = content.slice(0, startIndex);

        const endIndex = content.indexOf(UNIT_END, startIndex);
        if (endIndex >= 0) {
          const unit = createUnit(
            content.slice(startIndex + UNIT_START.length, endIndex),
            unitIndex++,
          );
          insertAfter(node, unit);

          const remain = document.createTextNode(
            content.slice(endIndex + UNIT_END.length),
          );
          insertAfter(unit, remain);
          traverseNode(remain);
        } else {
          const unit = createUnit(
            content.slice(startIndex + UNIT_START.length),
            unitIndex,
          );
          insertAfter(node, unit);
          inUnit = true;
        }
      }
    } else if (node.hasChildNodes()) {
      Array.from(node.childNodes).forEach((node) => traverseNode(node));
    } else if (node.nodeType === Node.ELEMENT_NODE && inUnit) {
      switch (node.nodeName) {
        case 'IMG': {
          tagUnit(node as Element, unitIndex);
          break;
        }
      }
    }
  }

  traverseNode(container);
  return inUnit ? unitIndex + 1 : unitIndex;
}
