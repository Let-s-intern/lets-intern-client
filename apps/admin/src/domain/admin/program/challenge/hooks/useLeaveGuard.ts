import { useCallback, useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';

export const LEAVE_MESSAGE =
  '저장하지 않은 변경사항이 있습니다. 저장하지 않고 나가시겠습니까?';

/**
 * 저장하지 않고 화면을 떠나려 하면 확인을 받는다 (LC-3505).
 * - 앱 안 이동은 react-router 의 useBlocker, 새로고침·탭 닫기는 beforeunload 로 막는다
 * - 처음 손대기 직전 상태를 기준으로 잡고, 떠나려는 순간에만 비교한다.
 *   본문 JSON 이 커서 입력마다 비교하지 않는다
 *
 * @param getSnapshot 저장 대상 상태를 문자열로. 렌더마다 최신 값을 쓴다
 * @param enabled false 면 묻지 않는다. 더 저장할 수 없는 화면(생성 완료 등)에서 끈다
 */
export function useLeaveGuard(getSnapshot: () => string, enabled = true) {
  const baseline = useRef<string | null>(null);
  const latest = useRef(getSnapshot);
  latest.current = getSnapshot;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const isDirty = useCallback(
    () =>
      enabledRef.current &&
      baseline.current !== null &&
      baseline.current !== latest.current(),
    [],
  );

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname && isDirty(),
  );

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    if (window.confirm(LEAVE_MESSAGE)) blocker.proceed();
    else blocker.reset();
  }, [blocker]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty()) return;
      event.preventDefault();
      // 브라우저는 자체 문구를 띄운다. returnValue 를 채워야 뜬다
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  /** 화면 루트의 pointerdown·keydown 캡처에 건다 */
  const trackInteraction = useCallback(() => {
    if (baseline.current === null) baseline.current = latest.current();
  }, []);

  /** 저장에 성공한 직후 부른다. 다음에 손댈 때 기준을 다시 잡는다 */
  const markSaved = useCallback(() => {
    baseline.current = null;
  }, []);

  return { trackInteraction, markSaved, isDirty };
}
