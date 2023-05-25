import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export enum ModifierKey {
  Control,
  Alt,
  Shift,
  Meta,
}

type Options = {
  node?: HTMLElement | null;
  modifierKey?: ModifierKey;
};

export const useKeyPress = (
  key: KeyboardEvent["key"],
  callback: (e: KeyboardEvent) => void,
  options: Options = {}
) => {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const modifierAndKeyPressed =
        options.modifierKey !== undefined &&
        event.key === key &&
        ((options.modifierKey === ModifierKey.Control && event.ctrlKey) ||
          (options.modifierKey === ModifierKey.Alt && event.altKey) ||
          (options.modifierKey === ModifierKey.Shift && event.shiftKey) ||
          (options.modifierKey === ModifierKey.Meta && event.metaKey));

      if (modifierAndKeyPressed) {
        event.preventDefault();
        callbackRef.current(event);
      }
    },
    [key, options.modifierKey]
  );

  useEffect(() => {
    const targetNode = options?.node ?? document;

    targetNode &&
      targetNode.addEventListener(
        "keydown",
        handleKeyPress as EventListener | EventListenerObject
      );

    return () =>
      targetNode &&
      targetNode.removeEventListener(
        "keydown",
        handleKeyPress as EventListener | EventListenerObject
      );
  }, [handleKeyPress, options]);
};
