import { useEffect } from 'react';

export default function useControlScroll(isOpen: boolean) {
  // 사이드바/모달이 열리면 스크롤 제한
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);
}
