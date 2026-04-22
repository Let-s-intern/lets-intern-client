import { useEffect } from 'react';

/** 모달, 사이드바 등이 열리면 스크롤 제한 */
export function useControlScroll(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);
}
