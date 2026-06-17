import { useEffect } from 'react';

export default function useBeforeUnloadWarning(condition: boolean) {
  useEffect(() => {
    const beforeUnloadListener = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return true;
    };

    if (!condition) {
      window.removeEventListener('beforeunload', beforeUnloadListener, {
        capture: true,
      });
    } else {
      window.addEventListener('beforeunload', beforeUnloadListener, {
        capture: true,
      });
    }

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadListener, {
        capture: true,
      });
    };
  }, [condition]);
}
