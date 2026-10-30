// 회고 조회(GET membership-ordinal) + 답변 제출/수정(membership-review).
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import type { PassRetrospectiveRound } from '../types';

const retrospectivesQueryKey = (applicationId: number) =>
  ['allInOnePass', 'retrospectives', applicationId] as const;

// ─── GET /membership-ordinal — 회차별 질문·기존답변·코멘트·상태 ───
const retroQuestionSchema = z.object({
  membershipQuestionId: z.number(),
  question: z.string().nullish(),
  answerGuide: z.string().nullish(),
  membershipReviewId: z.number().nullish(),
  review: z.string().nullish(),
});

const retroRoundSchema = z.object({
  id: z.number(),
  th: z.number(),
  visibleAt: z.string().nullish(),
  submissionDeadline: z.string().nullish(),
  visible: z.boolean(),
  writable: z.boolean(),
  submitted: z.boolean(),
  adminFeedback: z.string().nullish(),
  questions: z.array(retroQuestionSchema).default([]),
});

const toRound = (
  dto: z.infer<typeof retroRoundSchema>,
): PassRetrospectiveRound => ({
  id: dto.id,
  th: dto.th,
  visibleAt: dto.visibleAt ?? null,
  submissionDeadline: dto.submissionDeadline ?? null,
  visible: dto.visible,
  writable: dto.writable,
  submitted: dto.submitted,
  adminFeedback: dto.adminFeedback ?? null,
  questions: dto.questions.map((q) => ({
    membershipQuestionId: q.membershipQuestionId,
    question: q.question ?? '',
    answerGuide: q.answerGuide ?? '',
    membershipReviewId: q.membershipReviewId ?? null,
    review: q.review ?? null,
  })),
});

export const useGetPassRetrospectives = (applicationId: number) =>
  useQuery({
    queryKey: retrospectivesQueryKey(applicationId),
    queryFn: async (): Promise<PassRetrospectiveRound[]> => {
      const res = await axios.get('/membership-ordinal', {
        params: { membershipApplicationId: applicationId },
      });
      return z.array(retroRoundSchema).parse(res.data.data).map(toRound);
    },
    enabled: Number.isFinite(applicationId) && applicationId > 0,
    refetchOnWindowFocus: false,
  });

// ─── 답변 제출/수정 — 질문당 1건(POST 신규 / PATCH 수정) ───
export interface RetroSubmitItem {
  membershipQuestionId: number;
  membershipOrdinalId: number;
  review: string;
  membershipReviewId: number | null; // 있으면 수정, 없으면 신규
}

export const useSubmitRetrospective = (applicationId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: RetroSubmitItem[]) => {
      // 같은 회차 제출은 BE가 비관락으로 직렬화 → 병렬 전송 시 락 경합으로 500. 순차로 보냄.
      for (const it of items) {
        if (it.membershipReviewId != null) {
          await axios.patch(`/membership-review/${it.membershipReviewId}`, {
            review: it.review,
          });
        } else {
          await axios.post('/membership-review', {
            membershipQuestionId: it.membershipQuestionId,
            membershipOrdinalId: it.membershipOrdinalId,
            review: it.review,
          });
        }
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: retrospectivesQueryKey(applicationId),
      }),
  });
};
