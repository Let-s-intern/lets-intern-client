import { EffectCallback, useEffect, useRef } from 'react';

export default function useRunOnce(callback: EffectCallback) {
  const runOnce = useRef(false);

  useEffect(() => {
    if (!runOnce.current) {
      callback();
      runOnce.current = true;
    }
  }, []);
}
