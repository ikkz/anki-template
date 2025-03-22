import './cloze-input.css';
import { domToCloze, getClozeData, getClozeNodes } from './dom-to-cloze';
import type { FieldProps } from '@/components/native-field';
import { useBack } from '@/hooks/use-back';
import { crossStorage } from '@/utils/cross-storage';
import { AnkiField } from 'at/virtual/field';
import { FC, useEffect, useLayoutEffect, useRef } from 'react';

const CLOZED_ATTR = 'data-at-input-clozed';

function createInput(node: HTMLElement) {
  const input = document.createElement('input');
  input.classList.add('at-cloze-input');
  node.parentElement?.insertBefore(input, node);
}

const inputKey = (k: number) => `cloze-input-value-${k}`;

export const ClozeInputField: FC<FieldProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [back] = useBack();

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.style.visibility = 'hidden';
  }, []);

  useEffect(() => {
    const { current: el } = ref;
    if (!el) {
      return;
    }
    const clozeCount = domToCloze(el);
    if (!back) {
      if (el.getAttribute(CLOZED_ATTR) === 'true') {
        return;
      }
      el.setAttribute(CLOZED_ATTR, 'true');
      for (let clozeIndex = 0; clozeIndex < clozeCount; clozeIndex++) {
        crossStorage.removeItem(inputKey(clozeIndex));
        const nodes = getClozeNodes(el, clozeIndex);
        if (!nodes.length) {
          continue;
        }
        nodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            node.style.display = 'none';
          }
        });
        const firstNode = nodes[0];
        if (firstNode instanceof HTMLElement) {
          createInput(firstNode);
        }
      }
      el.addEventListener(
        'input',
        (event) => {
          const { target } = event;
          if (
            !(target instanceof HTMLInputElement) ||
            !target.nextSibling ||
            !(target.nextSibling instanceof Element)
          ) {
            return;
          }
          const data = getClozeData(target.nextSibling);
          if (!data) {
            return;
          }
          crossStorage.setItem(inputKey(data.index), target.value);
        },
        true,
      );
    } else {
      const items = Array.from({
        length: process.env.NODE_ENV === 'development' ? 4 : clozeCount,
      }).map((_, idx) => {
        const datas = getClozeNodes(el, idx).map(getClozeData);
        return {
          datas,
          answer: datas.map((data) => data?.answer || '').join(''),
          value: crossStorage.getItem(inputKey(idx), ''),
        };
      });
      console.log(items);
    }
    el.style.visibility = 'visible';
  }, [back]);
  return <AnkiField domRef={ref} {...props} />;
};
