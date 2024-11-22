import useCreation from 'ahooks/es/useCreation';
import clsx from 'clsx';
import { FC, memo, useCallback, useId } from 'react';

import { FIELD_ID } from '@/utils/const';

export const AnkiField: FC<{
  name: string;
  className?: string;
}> = memo(({ name, className }) => {
  const fieldNode = useCreation(
    () => document.getElementById(FIELD_ID(name)),
    [name],
  );

  const attachNode = useCallback(
    (ref: HTMLDivElement) => {
      if (fieldNode && ref) {
        fieldNode.remove();
        ref.appendChild(fieldNode);
      }
    },
    [fieldNode],
  );

  // useEffect(() => {
  //   return () => {
  //     if (fieldNode) {
  //       fieldNode.remove();
  //       document.getElementById(FIELDS_CONTAINER_ID)?.appendChild(fieldNode);
  //     }
  //   };
  // }, [fieldNode]);

  const styleId = useId();

  return (
    <div
      ref={attachNode}
      id={`anki-field-${name}`}
      className={clsx(
        'anki-field',
        'overflow-x-auto',
        'prose prose-neutral dark:prose-invert',
        styleId,
        className,
      )}
    />
  );
});
