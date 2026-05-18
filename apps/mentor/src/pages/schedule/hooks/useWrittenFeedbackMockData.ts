import { useMemo } from 'react';

import {
  MOCK_CHALLENGE_FILTER_ITEMS,
  WRITTEN_FEEDBACK_MOCK_DATA,
} from '../challenge-content/writtenFeedbackMock';
import type { PeriodBarData } from '../types';

/** 서면 피드백 목데이터 + 목 챌린지 필터 아이템 반환. */
export function useWrittenFeedbackMockData(): {
  bars: PeriodBarData[];
  challengeFilterItems: typeof MOCK_CHALLENGE_FILTER_ITEMS;
} {
  return useMemo(
    () => ({
      bars: WRITTEN_FEEDBACK_MOCK_DATA,
      challengeFilterItems: MOCK_CHALLENGE_FILTER_ITEMS,
    }),
    [],
  );
}
