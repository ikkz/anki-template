import { BACK_INDICATOR_ID, IS_DEV } from '@/utils/const';
import { atom, useAtom } from 'jotai';

declare global {
  interface Window {
    setBack?: (back: boolean) => void;
  }
}

const backAtom = atom(Boolean(document.getElementById(BACK_INDICATOR_ID)));

export const useBack = () => {
  const [back, setBack] = useAtom(backAtom);
  if (IS_DEV) {
    window.setBack = setBack;
  }
  return [back, setBack] as const;
};
