import { useTextSelection } from '@/hooks/use-text-selection';
import { toolsAtom } from '@/store/tools';
import { getUrl } from '@/utils/tool';
import { useAtomValue } from 'jotai/react';
import { FC, PropsWithChildren, useMemo, useRef } from 'react';
import { useThrottle } from 'react-use';

export const ToolsContext: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { clientRect, textContent } = useTextSelection(ref);
  const throttledRect = useThrottle(clientRect, 60);
  const text = textContent?.trim();
  const tools = useAtomValue(toolsAtom);

  const toolsPopover = useMemo(() => {
    if (!throttledRect || !text) {
      return null;
    }
    const { top, left, height } = throttledRect;
    return (
      <div
        className="pointer-events-none absolute flex items-center transition-all"
        style={{
          top: `${top + height + 10}px`,
          left: `${left}px`,
          zIndex: 999,
        }}
      >
        <div className="pointer-events-auto mx-auto flex flex-col rounded-md border bg-white p-1 shadow-xl text-sm">
          {tools.map((tool) => (
            <a
              key={tool.id}
              className="block p-2"
              href={getUrl(tool, text)}
              target="_blank"
              rel="noreferrer"
            >
              {tool.name}
            </a>
          ))}
        </div>
      </div>
    );
  }, [throttledRect, text, tools]);

  return (
    <div className="relative" ref={ref}>
      {children}
      {toolsPopover}
    </div>
  );
};
