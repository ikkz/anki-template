import { createJSONStorage } from 'jotai/utils';

const storageKey = (key: string) => `as-cross-${key}`;

const crossStorage = createJSONStorage(() => ({
  getItem(key) {
    return sessionStorage.getItem(storageKey(key));
  },
  setItem(key, newValue) {
    sessionStorage.setItem(storageKey(key), newValue);
  },
  removeItem(key) {
    sessionStorage.removeItem(storageKey(key));
  },
}));

export { crossStorage };
