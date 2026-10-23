import {
  RetrospectiveCommonQuestion,
  RetrospectiveRound,
} from '@/domain/all-in-one-pass/types';
import axios from '@/utils/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { mockDelay } from './mock/mockDelay';
import { retrospectiveResponseFixtures } from './mock/retrospectiveResponseFixtures';

/**
 * A-4/A-5 회고 훅.
 *
 * 공통·회차 질문은 실 API(GET/PATCH). 공통 질문은 조회 전용(수정 불가).
 * 응답 조회(A-5)는 BE 미완이라 아직 mock.
 */

type MutationCallbacks = {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
};

export const commonQuestionsQueryKey = 'allInOnePassCommonQuestions';
export const retrospectiveRoundsQueryKey = 'allInOnePassRetrospectiveRounds';
export const retrospectiveResponsesQueryKey =
  'allInOnePassRetrospectiveResponses';

// ── 공통 질문 (전 회차 공유, 읽기 전용) ──────
const commonQuestionSchema = z.object({
  id: z.number(),
  question: z.string().nullish(),
  answerGuide: z.string().nullish(),
  count: z.number().nullish(),
});

const toCommonQuestion = (
  dto: z.infer<typeof commonQuestionSchema>,
): RetrospectiveCommonQuestion => ({
  id: dto.id,
  question: dto.question ?? '',
  answerGuide: dto.answerGuide ?? '',
});

/** 특정 패스의 공통 질문 목록 (수정 불가, 조회만) */
export const useGetCommonQuestionsQuery = (passId?: number) =>
  useQuery({
    queryKey: [commonQuestionsQueryKey, passId],
    enabled: passId != null,
    queryFn: async () => {
      const res = await axios.get(`/admin/membershipQuestion/common/${passId}`);
      return z
        .array(commonQuestionSchema)
        .parse(res.data.data)
        .sort((a, b) => (a.count ?? 0) - (b.count ?? 0))
        .map(toCommonQuestion);
    },
  });

const ordinalQuestionSchema = z.object({
  id: z.number(),
  th: z.number(),
  question: z.string().nullish(),
  answerGuide: z.string().nullish(),
  answerNumber: z.number().nullish(),
  visiblePeriodType: z.string().nullish(),
  visiblePeriodValue: z.number().nullish(),
  periodType: z.string().nullish(),
  periodValue: z.number().nullish(),
});
type OrdinalQuestionDto = z.infer<typeof ordinalQuestionSchema>;

const toRetrospectiveRound = (dto: OrdinalQuestionDto): RetrospectiveRound => ({
  id: dto.id,
  round: dto.th,
  weeklyQuestion: dto.question ?? '',
  answerGuide: dto.answerGuide ?? '',
  responseCount: dto.answerNumber ?? 0,
  visiblePeriodType: dto.visiblePeriodType ?? null,
  visiblePeriodValue: dto.visiblePeriodValue ?? null,
  periodType: dto.periodType ?? null,
  periodValue: dto.periodValue ?? null,
});

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

export const useUpdateOrdinalQuestionsMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({
      membershipId,
      rounds,
    }: {
      membershipId: number;
      rounds: { th: number; question: string; answerGuide: string }[];
    }) => {
      const res = await axios.patch(
        `/admin/membershipQuestion/ordinal/${membershipId}`,
        rounds,
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
