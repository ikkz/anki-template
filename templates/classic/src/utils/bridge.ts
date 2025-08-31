import { IS_DEV } from './const';

declare const pycmd: (cmd: string) => void | undefined;
declare const study: { drawAnswer: () => void } | undefined;
declare const AnkiDroidJS: any;
declare const showAnswer: () => void | undefined;

declare global {
  interface Window {
    sendMessage2?: (type: string, pos: string) => void;
    anki: any;
    e2eAnki?: any;
  }
}

export function flipToBack() {
  if (typeof pycmd !== 'undefined') {
    pycmd('ans');
  } else if (typeof study !== 'undefined') {
    study.drawAnswer();
  } else if (typeof AnkiDroidJS !== 'undefined') {
    showAnswer();
  } else if (window.anki && window.sendMessage2) {
    window.sendMessage2('ankitap', 'midCenter');
  } else if (IS_DEV) {
    window.setBack?.(true);
  }
}

export function isAnkiDroid() {
  return typeof AnkiDroidJS !== 'undefined';
}

export function isAnkiClient() {
  return !IS_DEV && typeof window.e2eAnki === 'undefined';
}
