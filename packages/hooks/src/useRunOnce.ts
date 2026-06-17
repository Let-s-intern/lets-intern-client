import { useEffect, useRef } from 'react';

export default function useRunOnce(callback: () => void | Promise<void>) {
  const runOnce = useRef(false);

  useEffect(() => {
    if (!runOnce.current) {
      runOnce.current = true;
      const maybePromise = callback();
      if (maybePromise instanceof Promise) {
        maybePromise.catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e);
        });
      }
    }
  }, []);
}
