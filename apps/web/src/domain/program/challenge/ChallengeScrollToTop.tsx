'use client';

import { useEffect } from 'react';
import { useChallengeApplySheetStore } from './store/useChallengeApplySheetStore';

/**
 * 챌린지 상세 마운트 시 맨 위로 올린다 (redirect 뒤 스크롤이 남는 문제, 공용 ScrollToTop 과 같은 이유).
 * 참여 대상·시작일을 바꿔 들어온 경우만 스크롤을 유지한다 (LC-3632)
 */
const ChallengeScrollToTop = () => {
  useEffect(() => {
    const { keepScroll } = useChallengeApplySheetStore.getState();
    if (keepScroll) {
      useChallengeApplySheetStore.setState({ keepScroll: false });
      return;
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
};

export default ChallengeScrollToTop;
