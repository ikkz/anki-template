import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

interface ButtonProps {
  status?: 'normal' | 'danger';
  onClick?: () => void;
  className?: string;
}

export const Button: FC<PropsWithChildren & ButtonProps> = ({
  status = 'normal',
  onClick,
  children,
  className,
}) => (
  <button
    type="button"
    className={clsx('font-bold', className, {
      'text-indigo-500': status === 'normal',
      'text-red-500': status === 'danger',
    })}
    onClick={onClick}
  >
    {children}
  </button>
);
