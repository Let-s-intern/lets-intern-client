import { useMemo } from 'react';

import type { PeriodBarData } from '../types';
import { LIVE_FEEDBACK_MOCK_DATA } from '../challenge-content/liveFeedbackMock';

/**
 * 라이브 피드백 일정 데이터를 반환하는 훅.
 *
 * 현재는 목데이터를 사용합니다.
 * TODO: API 연동 시 이 훅 내부의 반환값을 useQuery 기반으로 교체하세요.
 *       반환 타입(PeriodBarData[])은 그대로 유지됩니다.
 */
export function useLiveFeedbackData(): PeriodBarData[] {
  return useMemo(() => LIVE_FEEDBACK_MOCK_DATA, []);
}
