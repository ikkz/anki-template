import { Button } from './button';
import { ToolsContext } from '@/features/tools/context';
import { selectionMenuAtom } from '@/store/settings';
import clsx from 'clsx';
import { useAtomValue } from 'jotai/react';
import { FC, PropsWithChildren, ReactNode } from 'react';

export const Block: FC<
  PropsWithChildren & {
    name: ReactNode;
    action?: string;
    onAction?: () => void;
    className?: string;
    id?: string;
    enableTools?: boolean;
  }
> = ({ children, className, name, id, enableTools, action, onAction }, ref) => {
  const prefSelectionMenu = useAtomValue(selectionMenuAtom);

  return (
    <div className={clsx('mb-6', className)} ref={ref} id={id}>
      <div className="mb-1 px-4 text-sm text-gray-500 flex justify-between">
        <span>{name}</span>
        {action ? <Button onClick={onAction}>{action}</Button> : null}
      </div>
      <div
        className={clsx(
          'rounded-xl border bg-white px-4 py-5',
          'dark:border-gray-500 dark:bg-opacity-5',
        )}
      >
        {enableTools && prefSelectionMenu ? (
          <ToolsContext>{children}</ToolsContext>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
