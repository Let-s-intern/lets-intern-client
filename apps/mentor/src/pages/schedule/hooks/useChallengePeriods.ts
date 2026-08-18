import { useMemo } from 'react';

import { useMentorChallengeListQuery } from '@/api/user/user';

import {
  type ChallengePeriod,
  toActiveChallengePeriods,
} from '../live-availability/utils/challengePeriod';

/**
 * 슬롯 그리드에 음영으로 깔 챌린지 기간 목록.
 *
 * `GET /challenge-mentor` 는 종료된 챌린지까지 전부 주므로 진행중인 것만 남긴다.
 * 자세한 이유는 `toActiveChallengePeriods` 주석 참고.
 *
 * 조회는 이미 있는 `useMentorChallengeListQuery` 를 그대로 쓴다. 챌린지 목록·공지
 * 화면과 query key 를 공유하므로 요청이 늘지 않는다.
 */
export const useChallengePeriods = ({
  enabled = true,
}: { enabled?: boolean } = {}): ChallengePeriod[] => {
  const { data } = useMentorChallengeListQuery({ enabled });
  const challenges = data?.myChallengeMentorVoList;
  return useMemo(
    () => toActiveChallengePeriods(challenges ?? []),
    [challenges],
  );
};
