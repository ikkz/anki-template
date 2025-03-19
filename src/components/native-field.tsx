import { useCloze } from '@/features/cloze/use-cloze';
import { FIELD_ID, FIELDS_CONTAINER_ID } from '@/utils/const';
import useCreation from 'ahooks/es/useCreation';
import clsx from 'clsx';
import { FC, memo, useCallback, useEffect, useId, useRef } from 'react';

export const NativeField: FC<{
  name: string;
  className?: string;
}> = memo(({ name, className }) => {
  const fieldNode = useCreation(
    () => document.getElementById(FIELD_ID(name)) as HTMLDivElement | null,
    [name],
  );
  const ref = useRef<HTMLDivElement | null>(null);

  const attachNode = useCallback(
    (node: HTMLDivElement) => {
      if (fieldNode && node) {
        fieldNode.remove();
        node.appendChild(fieldNode);
        if (ref) {
          ref.current = node;
        }
      }
    },
    [fieldNode],
  );

  useEffect(() => {
    return () => {
      if (fieldNode) {
        fieldNode.remove();
        document.getElementById(FIELDS_CONTAINER_ID)?.appendChild(fieldNode);
      }
    };
  }, [fieldNode]);

  const styleId = useId();

  if (name === 'question') {
    // wont change
    useCloze(ref);
  }

  return (
    <div
      ref={attachNode}
      id={`anki-field-${name}`}
      className={clsx(
        'anki-field anki-native-field',
        'overflow-x-auto',
        'prose prose-neutral dark:prose-invert',
        styleId,
        className,
      )}
    />
  );
});

export default NativeField;
