import { useTextSelection } from '@/hooks/use-text-selection';
import { FC, PropsWithChildren, useMemo, useRef } from 'react';
import { useThrottle } from 'react-use';

export const ToolsContext: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { clientRect, textContent } = useTextSelection(ref);
  const throttledRect = useThrottle(clientRect, 60);
  const text = textContent?.trim();

  const tools = useMemo(() => {
    if (!throttledRect || !text) {
      return null;
    }
    const { top, left, width, height } = throttledRect;
    return (
      <div
        className="pointer-events-none absolute flex items-center transition-all"
        style={{
          top: `${top + height + 10}px`,
          left: `${left}px`,
          width: `${width}px`,
          zIndex: 999,
        }}
      >
        <div className="pointer-events-auto mx-auto flex flex-row gap-2 rounded-md border bg-white p-2 shadow-xl">
          {'menu'}
        </div>
      </div>
    );
  }, [throttledRect, text]);

  return (
    <div className="relative" ref={ref}>
      {children}
      {tools}
    </div>
  );
};

interface Tool {
  name: string;
  prependText?: string;
  appendText?: string;
  url: string;
}

const ToolsMenu = () => {};
