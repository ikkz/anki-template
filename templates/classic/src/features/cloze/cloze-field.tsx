import { useCloze } from './use-cloze';
import type { FieldProps } from '@/components/native-field';
import { AnkiField } from 'at/virtual/field';
import { FC, useRef } from 'react';

export const ClozeField: FC<FieldProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  useCloze(ref);
  return <AnkiField domRef={ref} {...props} />;
};
