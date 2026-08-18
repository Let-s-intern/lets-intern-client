import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 클립보드 복사와 "복사됨" 표시.
 *
 * `navigator.clipboard` 는 보안 컨텍스트(https 또는 localhost)에서만 있다. 없거나 거부되면
 * **조용히 넘어가지 않고** 실패를 알린다 — 복사된 줄 알고 붙여넣었는데 빈 값이면
 * 화이트리스트 URL 을 손으로 옮겨 적게 되고, 그러다 오타가 나는 것이 애초에 이 기능이
 * 막으려던 사고다.
 */
export default function useCopyToClipboard(resetAfterMs = 2000) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const schedule = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCopiedKey(null);
      setFailedKey(null);
    }, resetAfterMs);
  }, [resetAfterMs]);

  const copy = useCallback(
    async (key: string, text: string) => {
      try {
        if (!navigator.clipboard) throw new Error('clipboard unavailable');
        await navigator.clipboard.writeText(text);
        setFailedKey(null);
        setCopiedKey(key);
      } catch {
        setCopiedKey(null);
        setFailedKey(key);
      }
      schedule();
    },
    [schedule],
  );

  return { copy, copiedKey, failedKey };
}
