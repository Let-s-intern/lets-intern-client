import {
  RetrospectiveCommonQuestion,
  RetrospectiveResponse,
  RetrospectiveRound,
} from '@/domain/all-in-one-pass/types';
import axios from '@/utils/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * 회고 훅. 공통·회차 질문, 응답 조회·코멘트.
 * 공통 질문은 조회 전용(수정 불가).
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

// ── 응답 목록: 특정 패스·회차 전체 참여자 ──────
const ordinalAnswerSchema = z.object({
  membershipQuestionId: z.number(),
  common: z.boolean().nullish(),
  question: z.string().nullish(),
  review: z.string().nullish(),
  submittedAt: z.string().nullish(),
});

const ordinalResponseSchema = z.object({
  id: z.number(),
  userName: z.string().nullish(),
  th: z.number().nullish(),
  submitted: z.boolean().nullish(),
  adminFeedback: z.string().nullish(),
  questions: z.array(ordinalAnswerSchema).default([]),
});

const toRetrospectiveResponse = (
  dto: z.infer<typeof ordinalResponseSchema>,
): RetrospectiveResponse => ({
  id: dto.id,
  submitterName: dto.userName ?? '',
  submittedAt: dto.questions.find((q) => q.submittedAt)?.submittedAt ?? '',
  submitted: dto.submitted ?? false,
  answers: dto.questions.map((q) => ({
    questionId: q.membershipQuestionId,
    questionLabel: q.question ?? '',
    answer: q.review ?? '',
  })),
  adminFeedback: dto.adminFeedback ?? null,
});

/** 특정 패스(membershipId)·회차(th)의 전체 참여자 응답 목록 */
export const useGetRetrospectiveResponsesQuery = (params?: {
  membershipId?: number;
  th?: number;
}) =>
  useQuery({
    queryKey: [
      retrospectiveResponsesQueryKey,
      params?.membershipId,
      params?.th,
    ],
    enabled: params?.membershipId != null && params?.th != null,
    queryFn: async () => {
      const res = await axios.get('/admin/membership-ordinal/by-round', {
        params: { membershipId: params!.membershipId, th: params!.th },
      });
      return z
        .array(ordinalResponseSchema)
        .parse(res.data.data)
        .map(toRetrospectiveResponse);
    },
  });

export const useUpdateOrdinalFeedbackMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({
      ordinalId,
      adminFeedback,
    }: {
      ordinalId: number;
      adminFeedback: string;
    }) => {
      const res = await axios.patch(
        `/admin/membership-ordinal/${ordinalId}/feedback`,
        { adminFeedback },
      );
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

export const useDeleteOrdinalFeedbackMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async (ordinalId: number) => {
      await axios.delete(`/admin/membership-ordinal/${ordinalId}/feedback`);
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
