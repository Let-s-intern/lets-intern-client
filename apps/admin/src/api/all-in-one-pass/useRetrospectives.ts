import { useQuery } from '@tanstack/react-query';
import {
  commonQuestionFixtures,
  retrospectiveRoundFixtures,
} from './mock/retrospectiveFixtures';
import { mockDelay } from './mock/passStore';

/**
 * A-4 회고 관리 훅 (읽기 전용).
 *
 * 저장(생성/수정/삭제)은 API 연결 후 붙인다. 현재는 mock 시드
 * (./mock/retrospectiveFixtures)를 읽으며, 스펙이 나오면 queryFn 본문만 교체한다.
 */

export const commonQuestionsQueryKey = 'allInOnePassCommonQuestions';
export const retrospectiveRoundsQueryKey = 'allInOnePassRetrospectiveRounds';

/** 공통 질문 목록 (order 순) */
export const useGetCommonQuestionsQuery = () =>
  useQuery({
    queryKey: [commonQuestionsQueryKey],
    queryFn: () =>
      mockDelay([...commonQuestionFixtures].sort((a, b) => a.order - b.order)),
  });

/** 회차 목록 (회차 순) */
export const useGetRetrospectiveRoundsQuery = () =>
  useQuery({
    queryKey: [retrospectiveRoundsQueryKey],
    queryFn: () =>
      mockDelay(
        [...retrospectiveRoundFixtures].sort((a, b) => a.round - b.round),
      ),
  });
