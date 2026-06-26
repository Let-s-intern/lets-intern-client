/**
 * LC-3065 회귀 가드 — 피드백 미션 목록의 라이브/서면 구분값(challengeOptionType)이
 * 스키마에서 누락되지 않는지 검증한다.
 *
 * 과거 버그: challengeMissionFeedbackListSchema 가 challengeOptionType 을 파싱하지
 * 않아, BE 가 LIVE_FEEDBACK 을 내려줘도 값이 버려졌고 → 멘토 캘린더가 라이브 피드백을
 * 서면 피드백 기간 바로 잘못 노출했다. (ChallengeDataFetcher 의 게이트가 이 값을 본다.)
 */
import { describe, expect, it } from 'vitest';

import { challengeMissionFeedbackListSchema } from '../challengeSchema';

const baseMission = {
  id: 1001,
  title: '미션 1',
  th: 1,
  startDate: '2026-04-20T00:00:00',
  endDate: '2026-04-25T00:00:00',
  challengeOptionCode: 'CODE',
  challengeOptionTitle: '옵션',
  submittedCount: 3,
  totalCount: 5,
};

describe('challengeMissionFeedbackListSchema — challengeOptionType', () => {
  it('LIVE_FEEDBACK / WRITTEN_FEEDBACK 값을 보존한다', () => {
    const { missionList } = challengeMissionFeedbackListSchema.parse({
      missionList: [
        { ...baseMission, id: 1, challengeOptionType: 'LIVE_FEEDBACK' },
        { ...baseMission, id: 2, challengeOptionType: 'WRITTEN_FEEDBACK' },
      ],
    });

    expect(missionList[0].challengeOptionType).toBe('LIVE_FEEDBACK');
    expect(missionList[1].challengeOptionType).toBe('WRITTEN_FEEDBACK');
  });

  it('필드가 없는 구버전 응답도 파싱되며 값은 nullish 로 폴백한다(서면 취급)', () => {
    const { missionList } = challengeMissionFeedbackListSchema.parse({
      missionList: [baseMission],
    });

    expect(missionList[0].challengeOptionType ?? null).toBeNull();
  });
});
