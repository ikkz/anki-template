export const domToMd = (dom: HTMLElement) => {
  const nodes = dom.querySelectorAll('img, br');
  for (const node of nodes) {
    const parent = node.parentNode;
    if (!parent) {
      continue;
    }
    const span = document.createElement('span');
    switch (node.tagName.toUpperCase()) {
      case 'IMG': {
        span.textContent = node.outerHTML;
        break;
      }
      case 'BR': {
        span.textContent = '\n';
      }
    }
    parent.insertBefore(span, node);
    node.remove();
  }
  return dom.textContent || '';
};
