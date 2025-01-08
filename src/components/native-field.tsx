import { domToCloze } from '@/features/cloze/dom-to-cloze';
import { FIELD_ID, FIELDS_CONTAINER_ID } from '@/utils/const';
import useCreation from 'ahooks/es/useCreation';
import clsx from 'clsx';
import {
  FC,
  memo,
  MutableRefObject,
  useCallback,
  useEffect,
  useId,
} from 'react';

export const NativeField: FC<{
  name: string;
  className?: string;
  enableCloze?: boolean;
  fieldRef?: MutableRefObject<HTMLDivElement | null>;
}> = memo(({ name, className, enableCloze, fieldRef }) => {
  const fieldNode = useCreation(
    () => document.getElementById(FIELD_ID(name)) as HTMLDivElement | null,
    [name],
  );

  const attachNode = useCallback(
    (ref: HTMLDivElement) => {
      if (fieldNode && ref) {
        fieldNode.remove();
        if (enableCloze) {
          domToCloze(fieldNode);
        }
        ref.appendChild(fieldNode);
        if (fieldRef) {
          fieldRef.current = ref;
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
