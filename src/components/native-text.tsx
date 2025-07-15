import { FC, useLayoutEffect, useRef } from 'react';

declare global {
  interface Window {
    MathJax?: {
      typesetPromise(els: HTMLElement[]): Promise<void>;
    };
  }
}

export const NativeText: FC<{ text: string }> = ({ text }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const span = document.createElement('span');
    span.innerText = text;
    ref.current?.appendChild(span);
    window.MathJax?.typesetPromise?.([span]);
    return () => span.remove();
  }, [text]);

  return <span ref={ref} />;
};
