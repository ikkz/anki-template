import { useBack } from '../../hooks/use-back';
import { CLOZE_CLASS } from '@/features/cloze/dom-to-cloze';
import { useLayoutEffect, useRef } from 'react';
import { doNothing } from 'remeda';

const useClozeRef = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [back] = useBack();
  useLayoutEffect(() => {
    const { current: el } = ref;
    if (!el) {
      return doNothing;
    }
    if (!back) {
      document.querySelectorAll(`span.${CLOZE_CLASS}`).forEach((el) => {
        const answer = el.textContent;
        if (answer) {
          el.textContent = '____';
        }
      });
    }

    const onClick = (event: MouseEvent) => {
      console.log(event.target);
    };
    el.addEventListener('click', onClick, true);

    return () => {
      el.removeEventListener('click', onClick, true);
    };
  }, [back]);
  return ref;
};

export { useClozeRef };
