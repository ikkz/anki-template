import { id } from 'at/options';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

const storage = createJSONStorage<any>(() => localStorage);

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
