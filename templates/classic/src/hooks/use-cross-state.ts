import { crossStorage } from '@/utils/cross-storage';
import { isBack } from '@/utils/is-back';
import useCreation from 'ahooks/es/useCreation';
import { useState } from 'react';

export function useCrossState<T>(key: string, init: T | (() => T)) {
  const initialValue = useCreation(
    () => (typeof init === 'function' ? (init as () => T)() : init),
    [],
  );

  const [state, setState] = useState(() => {
    if (isBack()) {
      return crossStorage.getItem(key, initialValue) as T;
    } else {
      crossStorage.setItem(key, initialValue);
      return initialValue;
    }
  });

  return [
    state,
    (value: T) => {
      setState(value);
      crossStorage.setItem(key, value);
    },
  ] as const;
}
