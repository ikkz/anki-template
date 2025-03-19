import { useBack } from '../../hooks/use-back';
import hiddenImg from '@/assets/cloze-img-hide.svg';
import {
  CLOZE_ANSWER_ATTR,
  CLOZE_CLASS,
  CLOZE_INDEX_ATTR,
  domToCloze,
} from '@/features/cloze/dom-to-cloze';
import { clozeAtom } from '@/store/settings';
import { entry } from 'at/options';
import { useAtomValue } from 'jotai';
import { RefObject, useLayoutEffect } from 'react';
import { doNothing } from 'remeda';

const CLOZE_HIDDEN = 'data-at-cloze-hide';

function isClozeHidden(node: Element) {
  return node.getAttribute(CLOZE_HIDDEN) === 'true';
}

function getAnswer(node: Element) {
  return node.getAttribute(CLOZE_ANSWER_ATTR);
}

function getClozeNodes(container: Element, node: Element) {
  const index = node.getAttribute(CLOZE_INDEX_ATTR);
  if (index === null) {
    return [];
  }
  return container.querySelectorAll(`[${CLOZE_INDEX_ATTR}='${index}'`);
}

function showAnswer(node: Element) {
  node.setAttribute(CLOZE_HIDDEN, 'false');
  const answer = getAnswer(node);
  switch (node.tagName) {
    case 'IMG': {
      node.setAttribute('src', answer || '');
      break;
    }
    case 'SPAN': {
      node.textContent = answer;
      break;
    }
  }
}

function hideAnswer(node: Element) {
  node.setAttribute(CLOZE_HIDDEN, 'true');
  switch (node.tagName) {
    case 'IMG': {
      node.setAttribute('src', hiddenImg);
      break;
    }
    case 'SPAN': {
      node.textContent = '          ';
      break;
    }
  }
}

const CLOZED_ATTR = 'data-at-clozed';

const useCloze = (ref: RefObject<HTMLElement>) => {
  const [back] = useBack();
  const clozeEnabled = useAtomValue(clozeAtom) || entry === 'cloze';
  useLayoutEffect(() => {
    const { current: el } = ref;
    if (!el || !clozeEnabled) {
      return doNothing;
    }
    if (!el.getAttribute(CLOZED_ATTR)) {
      domToCloze(el);
      el.setAttribute(CLOZED_ATTR, 'true');
    }

    document.querySelectorAll(`.${CLOZE_CLASS}`).forEach((el) => {
      if (!back) {
        hideAnswer(el);
      } else {
        showAnswer(el);
      }
    });

    const onClick = (event: MouseEvent) => {
      if (back) {
        return;
      }
      const node = event.target as Element | null;
      if (!node?.classList.contains(CLOZE_CLASS)) {
        return;
      }
      getClozeNodes(el, node).forEach((node) => {
        if (isClozeHidden(node)) {
          showAnswer(node);
        } else {
          hideAnswer(node);
        }
      });
    };
    el.addEventListener('click', onClick, true);

    return () => {
      el.removeEventListener('click', onClick, true);
    };
  }, [back, clozeEnabled]);
};

export { useCloze };
