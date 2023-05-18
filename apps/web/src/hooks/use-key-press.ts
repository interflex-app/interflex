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
      if (event.key !== key) return;

      event.preventDefault();

      if (options.modifierKey) {
        switch (options.modifierKey as ModifierKey) {
          case ModifierKey.Control:
            if (!event.ctrlKey) return;
            break;
          case ModifierKey.Alt:
            if (!event.altKey) return;
            break;
          case ModifierKey.Shift:
            if (!event.shiftKey) return;
            break;
          case ModifierKey.Meta:
            if (!event.metaKey) return;
            break;
        }
      }

      callbackRef.current(event);
    },
    [key]
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
