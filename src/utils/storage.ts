import { isAnkiDroid } from './bridge';
import { getAnkiStorage } from 'anki-storage';
import { id } from 'at/options';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { doNothing } from 'remeda';

declare global {
  interface Window {
    atDefaultOptions?: Record<string, string>;
  }
}

const { atDefaultOptions } = window;

// set default options to localStorage when this template type is displayed first time
// users can still change the options, which will take effects during this Anki execution
const initKey = `at:init:${id}`;
if (atDefaultOptions && !sessionStorage.getItem(initKey)) {
  Object.entries(atDefaultOptions).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
  sessionStorage.setItem(initKey, 'true');
}
const defaultOptionKeys = Object.keys(atDefaultOptions || {});

function isDefaultOptionKey(key: string) {
  return defaultOptionKeys.includes(key);
}

function createAnkiDroidStorage() {
  const as: ReturnType<typeof getAnkiStorage> = new Promise((resolve) => {
    setTimeout(() => {
      resolve(getAnkiStorage());
    }, 0);
  });
  const updaters = new Map<string, Array<(value: string | null) => void>>();

  return createJSONStorage<any>(() => ({
    getItem(key) {
      if (!isDefaultOptionKey(key)) {
        as.then((api) => {
          api.localStorage.getItem(key).then((value) => {
            if (value !== localStorage.getItem(key)) {
              if (value === null) {
                localStorage.removeItem(key);
              } else {
                localStorage.setItem(key, value);
              }
              updaters.get(key)?.forEach((fn) => fn(value));
            }
          });
        });
      }
      return localStorage.getItem(key);
    },
    setItem(key, newValue) {
      localStorage.setItem(key, newValue);
      if (!isDefaultOptionKey(key)) {
        as.then((api) => {
          api.localStorage.setItem(key, newValue);
        });
      }
    },
    removeItem(key) {
      localStorage.removeItem(key);
      if (!isDefaultOptionKey(key)) {
        as.then((api) => {
          api.localStorage.removeItem(key);
        });
      }
    },
    subscribe(key, callback) {
      if (isDefaultOptionKey(key)) {
        return doNothing;
      }
      if (updaters.has(key)) {
        updaters.get(key)?.push(callback);
      } else {
        updaters.set(key, [callback]);
      }
      return () => {
        const callbacks = updaters.get(key);
        if (callbacks) {
          const idx = callbacks.indexOf(callback);
          if (idx >= 0) {
            callbacks.splice(idx, 1);
          }
        }
      };
    },
  }));
}

const storage = isAnkiDroid()
  ? createAnkiDroidStorage()
  : createJSONStorage<any>(() => localStorage);

export const atomWithScopedStorage =
  /*@__NO_SIDE_EFFECTS__*/
  <T>(key: string, initialValue: T) =>
    atomWithStorage<T>(`at:${id}:${key}`, initialValue, storage, {
      getOnInit: true,
    });

export const atomWithGlobalStorage =
  /*@__NO_SIDE_EFFECTS__*/
  <T>(key: string, initialValue: T) =>
    atomWithStorage<T>(`at:_global:${key}`, initialValue, storage, {
      getOnInit: true,
    });
