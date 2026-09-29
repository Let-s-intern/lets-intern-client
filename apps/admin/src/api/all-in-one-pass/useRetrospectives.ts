import { useQuery } from '@tanstack/react-query';
import { buildRoundsForPass } from './mock/retrospectiveFixtures';
import { retrospectiveResponseFixtures } from './mock/retrospectiveResponseFixtures';
import { mockDelay } from './mock/passStore';

/**
 * A-4/A-5 회고 훅 (읽기 전용).
 *
 * 공통 질문은 하드코딩 상수(CommonQuestionSection)라 쿼리가 없다. 회차 저장은 API
 * 연결 후 붙인다. 현재는 mock 시드를 읽으며, 스펙이 나오면 queryFn 본문만 교체한다.
 */

export const retrospectiveRoundsQueryKey = 'allInOnePassRetrospectiveRounds';
export const retrospectiveResponsesQueryKey =
  'allInOnePassRetrospectiveResponses';

/** 특정 패스의 회차 목록 (회차 수는 패스 기간으로 자동 산출) */
export const useGetRetrospectiveRoundsQuery = (passId?: number) =>
  useQuery({
    queryKey: [retrospectiveRoundsQueryKey, passId],
    enabled: passId != null,
    queryFn: () => mockDelay(passId != null ? buildRoundsForPass(passId) : []),
  });

/** 특정 회차의 응답 목록 (A-5) */
export const useGetRetrospectiveResponsesQuery = (roundId?: number) =>
  useQuery({
    queryKey: [retrospectiveResponsesQueryKey, roundId],
    enabled: roundId != null,
    queryFn: () =>
      mockDelay(
        roundId != null ? (retrospectiveResponseFixtures[roundId] ?? []) : [],
      ),
  });
