// modified from https://github.com/juliankrispel/use-text-selection/blob/master/src/index.tsx
import { RefObject, useCallback, useLayoutEffect, useState } from 'react';
import { mapValues } from 'remeda';

type ClientRect = Record<keyof Omit<DOMRect, 'toJSON'>, number>;

function roundValues(_rect: ClientRect) {
  return mapValues(_rect, Math.round);
}

function shallowDiff(prev: any, next: any) {
  if (prev != null && next != null) {
    for (const key of Object.keys(next)) {
      if (prev[key] !== next[key]) {
        return true;
      }
    }
  } else if (prev !== next) {
    return true;
  }
  return false;
}

type TextSelectionState = {
  clientRect?: ClientRect;
  isCollapsed?: boolean;
  textContent?: string;
};

const defaultState: TextSelectionState = {};

export function useTextSelection(target: RefObject<HTMLElement>) {
  const [{ clientRect, isCollapsed, textContent }, setState] =
    useState<TextSelectionState>(defaultState);

  // const reset = useCallback(() => {
  //   setState(defaultState);
  // }, []);

  const handler = useCallback(() => {
    let newRect: ClientRect;
    const selection = window.getSelection();
    const newState: TextSelectionState = {};

    if (!target.current || selection == null || !selection.rangeCount) {
      setState(newState);
      return;
    }

    const range = selection.getRangeAt(0);

    if (!target.current.contains(range.commonAncestorContainer)) {
      setState(newState);
      return;
    }

    if (range === null) {
      setState(newState);
      return;
    }

    const contents = range.cloneContents();

    if (contents.textContent !== null) {
      newState.textContent = contents.textContent;
    }

    const rects = range.getClientRects();

    if (rects.length === 0 && range.commonAncestorContainer !== null) {
      const el = range.commonAncestorContainer as HTMLElement;
      if (!el.getBoundingClientRect) {
        return;
      }
      newRect = roundValues(el.getBoundingClientRect().toJSON());
    } else {
      if (rects.length < 1) {
        return;
      }
      newRect = roundValues(rects[rects.length - 1].toJSON());
    }
    const targetRect = target.current.getBoundingClientRect();
    if (shallowDiff(clientRect, newRect)) {
      newState.clientRect = {
        ...newRect,
        left: newRect.left - targetRect.left,
        top: newRect.top - targetRect.top,
      };
    }
    newState.isCollapsed = range.collapsed;

    setState(newState);
  }, []);

  useLayoutEffect(() => {
    document.addEventListener('selectionchange', handler);
    document.addEventListener('keydown', handler);
    document.addEventListener('keyup', handler);
    window.addEventListener('resize', handler);

    return () => {
      document.removeEventListener('selectionchange', handler);
      document.removeEventListener('keydown', handler);
      document.removeEventListener('keyup', handler);
      window.removeEventListener('resize', handler);
    };
  }, [target]);

  return {
    clientRect,
    isCollapsed,
    textContent,
  };
}
