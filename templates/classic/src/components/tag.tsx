import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

type Color = 'default' | 'yellow' | 'red' | 'green';

const COLORS: Record<Color, string> = {
  default: 'bg-indigo-100 dark:bg-indigo-900',
  yellow: 'bg-yellow-100 dark:bg-yellow-900',
  red: 'bg-red-100 dark:bg-red-900',
  green: 'bg-green-100 dark:bg-green-900',
};

export const Tag: FC<
  PropsWithChildren & { color?: Color; className?: string; size?: 'sm' | 'md' }
> = ({ color = 'default', children, className, size = 'md' }) => {
  return (
    <div
      className={clsx(
        'rounded-md',
        COLORS[color],
        { sm: 'p-1 text-sm', md: 'p-2' }[size],
        className,
      )}
    >
      {children}
    </div>
  );
};
