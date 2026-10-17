import { RetrospectiveRound } from '@/domain/all-in-one-pass/types';
import { useQuery } from '@tanstack/react-query';
import { mockDelay } from './mock/mockDelay';
import {
  buildOrdinalQuestionsForPass,
  OrdinalQuestionDto,
} from './mock/retrospectiveFixtures';
import { retrospectiveResponseFixtures } from './mock/retrospectiveResponseFixtures';

/**
 * A-4/A-5 회고 훅 (읽기 전용).
 *
 * 회차 질문은 BE DTO(OrdinalQuestionDto)로 받아 화면 타입으로 매핑한다. 실 API 연결
 * 시 queryFn의 데이터 소스만 axios 로 교체하면 된다. 공통 질문은 읽기 전용 상수
 * (CommonQuestionSection)라 쿼리가 없다. 회차 저장(PATCH)은 API 연결 후 붙인다.
 */

export const retrospectiveRoundsQueryKey = 'allInOnePassRetrospectiveRounds';
export const retrospectiveResponsesQueryKey =
  'allInOnePassRetrospectiveResponses';

const toRetrospectiveRound = (dto: OrdinalQuestionDto): RetrospectiveRound => ({
  id: dto.id,
  round: dto.th,
  weeklyQuestion: dto.question ?? '',
  answerGuide: dto.answerGuide ?? '',
  responseCount: dto.responseCount ?? 0,
});

/** 특정 패스의 회차 목록 (회차 수는 패스 기간으로 BE가 자동 산출) */
export const useGetRetrospectiveRoundsQuery = (passId?: number) =>
  useQuery({
    queryKey: [retrospectiveRoundsQueryKey, passId],
    enabled: passId != null,
    queryFn: async () => {
      // 실 API: GET /admin/membershipQuestion/ordinal/{passId} → parse → map
      const dtos = passId != null ? buildOrdinalQuestionsForPass(passId) : [];
      return (await mockDelay(dtos)).map(toRetrospectiveRound);
    },
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
