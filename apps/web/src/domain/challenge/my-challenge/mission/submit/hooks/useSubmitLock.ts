import { useRef, useState } from 'react';

/**
 * 제출 요청이 끝날 때까지 다음 제출을 막는 잠금.
 *
 * 상태만으로는 같은 렌더 안에서 연속으로 들어온 호출을 막지 못한다(모두 이전 값
 * false 를 본다). 막는 판단은 ref 로 하고, 상태는 버튼을 끄는 화면 표시에만 쓴다.
 */
export function useSubmitLock() {
  const isLockedRef = useRef(false);
  const [isLocked, setIsLocked] = useState(false);

  /** 잠금을 잡으면 true, 이미 진행 중이면 false. */
  const lock = () => {
    if (isLockedRef.current) return false;
    isLockedRef.current = true;
    setIsLocked(true);
    return true;
  };

  const unlock = () => {
    isLockedRef.current = false;
    setIsLocked(false);
  };

  return { isLocked, lock, unlock };
}
