import { RetrospectiveRound } from '@/domain/all-in-one-pass/types';
import axios from '@/utils/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { mockDelay } from './mock/mockDelay';
import { retrospectiveResponseFixtures } from './mock/retrospectiveResponseFixtures';

/**
 * A-4/A-5 회고 훅.
 *
 * 회차 질문은 실 API(GET/PATCH). answerGuide·responseCount 는 BE 반영 전엔 응답에
 * 없어 nullish 로 두고, 생기면 자동으로 채워진다. 공통 질문은 읽기전용 상수
 * (CommonQuestionSection). 응답 조회(A-5)는 BE 미완이라 아직 mock.
 */

type MutationCallbacks = {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
};

export const retrospectiveRoundsQueryKey = 'allInOnePassRetrospectiveRounds';
export const retrospectiveResponsesQueryKey =
  'allInOnePassRetrospectiveResponses';

// 회차 질문 응답 (server MembershipOrdinalQuestion)
const ordinalQuestionSchema = z.object({
  id: z.number(),
  th: z.number(),
  question: z.string().nullish(),
  answerGuide: z.string().nullish(), // BE GET 추가 예정
  responseCount: z.number().nullish(), // BE 추가 예정 (현재 count는 정렬값)
});
type OrdinalQuestionDto = z.infer<typeof ordinalQuestionSchema>;

const toRetrospectiveRound = (dto: OrdinalQuestionDto): RetrospectiveRound => ({
  id: dto.id,
  round: dto.th,
  weeklyQuestion: dto.question ?? '',
  answerGuide: dto.answerGuide ?? '',
  responseCount: dto.responseCount ?? 0,
});

/** 특정 패스의 회차 질문 목록 (회차·질문 ID 오름차순) */
export const useGetRetrospectiveRoundsQuery = (passId?: number) =>
  useQuery({
    queryKey: [retrospectiveRoundsQueryKey, passId],
    enabled: passId != null,
    queryFn: async () => {
      const res = await axios.get(
        `/admin/membershipQuestion/ordinal/${passId}`,
      );
      return z
        .array(ordinalQuestionSchema)
        .parse(res.data.data)
        .map(toRetrospectiveRound);
    },
  });

/** 회차 질문·답변 가이드 수정 (전달하지 않은 필드는 기존 값 유지) */
export const useUpdateOrdinalQuestionMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({
      membershipId,
      questionId,
      question,
      answerGuide,
    }: {
      membershipId: number;
      questionId: number;
      question: string;
      answerGuide: string;
    }) => {
      const res = await axios.patch(
        `/admin/membershipQuestion/ordinal/${membershipId}/${questionId}`,
        { question, answerGuide },
      );
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

/** 특정 회차의 응답 목록 (A-5, 아직 mock) */
export const useGetRetrospectiveResponsesQuery = (roundId?: number) =>
  useQuery({
    queryKey: [retrospectiveResponsesQueryKey, roundId],
    enabled: roundId != null,
    queryFn: () =>
      mockDelay(
        roundId != null ? (retrospectiveResponseFixtures[roundId] ?? []) : [],
      ),
  });
