import { isBack } from '@/utils/is-back';
import useCreation from 'ahooks/es/useCreation';
import { useState } from 'react';

const storageKey = (key: string) => `as-storage-${key}`;

export function useCrossState<T>(key: string, init: T | (() => T)) {
  const initialValue = useCreation(
    () => (typeof init === 'function' ? (init as () => T)() : init),
    [],
  );
  const getStoreValue = (): T => {
    try {
      const str = sessionStorage.getItem(storageKey(key));
      if (str) {
        return JSON.parse(str);
      }
      return initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  };

  const setStoreValue = (value: T) => {
    try {
      sessionStorage.setItem(storageKey(key), JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };

  const [state, setState] = useState(() => {
    if (isBack()) {
      return getStoreValue();
    } else {
      setStoreValue(initialValue);
      return initialValue;
    }
  });

  return [
    state,
    (value: T) => {
      setState(value);
      setStoreValue(value);
    },
  ] as const;
}
