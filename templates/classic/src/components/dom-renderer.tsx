import { FC, useCallback } from 'react';

export const DomRenderer: FC<{ dom: HTMLElement }> = ({ dom }) => {
  const attachNode = useCallback(
    (ref: HTMLDivElement) => {
      if (dom && ref) {
        dom.remove();
        ref.appendChild(dom);
      }
    },
    [dom],
  );
  return <div ref={attachNode} />;
};
