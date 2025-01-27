const SUPPORTED_TAGS = ['img', 'br'] as const;

export const domToText = (
  dom: HTMLElement,
  transformTags: readonly (typeof SUPPORTED_TAGS)[number][] = SUPPORTED_TAGS,
) => {
  if (transformTags.length) {
    const nodes = dom.querySelectorAll(transformTags.join(', '));
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
  }
  return dom.textContent || '';
};
