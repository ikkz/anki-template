import { ToolsContext } from '@/features/tools/context';
import { selectionMenuAtom } from '@/store/settings';
import { tw } from '@/styles/tw';
import clsx from 'clsx';
import { useAtomValue } from 'jotai/react';
import { FC, PropsWithChildren, ReactNode } from 'react';

export const Block: FC<
  PropsWithChildren & {
    name: ReactNode;
    action?: ReactNode;
    className?: string;
    id?: string;
    enableTools?: boolean;
  }
> = ({ children, className, name, id, enableTools, action }, ref) => {
  const prefSelectionMenu = useAtomValue(selectionMenuAtom);

  return (
    <div className={clsx('mb-6 sm:mx-5', className)} ref={ref} id={id}>
      <div className="mb-1 mx-5 text-sm text-gray-500 flex justify-between">
        <span>{name}</span>
        {action ? action : null}
      </div>
      <div
        className={clsx(
          'sm:rounded-xl border-y sm:border bg-white px-5 py-5',
          'dark:bg-opacity-5',
          tw.borderColor,
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
