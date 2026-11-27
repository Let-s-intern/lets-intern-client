import { ChallengePricePlanEnum } from '@/schema';
import axiosV2 from '@/utils/axiosV2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

export const answerStatusSchema = z.enum(['WAITING', 'COMPLETED']);
export type AnswerStatus = z.infer<typeof answerStatusSchema>;

const challengeQuestionItemSchema = z.object({
  id: z.number(),
  answerStatus: answerStatusSchema,
  title: z.string(),
  content: z.string(),
  answer: z.string().nullable(),
  isVisible: z.boolean(),
  challengeId: z.number(),
  challengeTitle: z.string(),
  userId: z.number(),
  userName: z.string(),
  email: z.string(),
  phoneNum: z.string().nullable().optional(),
  wishJob: z.string().nullable().optional(),
  wishCompany: z.string().nullable().optional(),
  challengePricePlanType: ChallengePricePlanEnum.nullable().optional(),
  // 서버 배포 전이면 필드가 없다
  isAnswerRead: z.boolean().optional().default(false),
  imageUrls: z.array(z.string()).optional().default([]),
  createDate: z.string(),
});

export type ChallengeQuestionItem = z.infer<typeof challengeQuestionItemSchema>;

const pageInfoSchema = z.object({
  totalElements: z.number(),
  totalPages: z.number(),
  pageNum: z.number(),
  pageSize: z.number(),
});

const challengeQuestionsResponseSchema = z.object({
  questionList: z.array(challengeQuestionItemSchema),
  pageInfo: pageInfoSchema,
});

export const CHALLENGE_QUESTIONS_QUERY_KEY = 'challengeQuestions';

export const useAllChallengeQuestionsQuery = ({
  answerStatus,
  page,
  size,
  userId,
}: {
  answerStatus?: AnswerStatus;
  page: number;
  size: number;
  /** 주면 그 유저가 올린 문의만 조회한다. 유저 상세의 문의 탭이 쓴다 */
  userId?: number;
}) => {
  return useQuery({
    queryKey: [
      CHALLENGE_QUESTIONS_QUERY_KEY,
      'all',
      answerStatus,
      page,
      size,
      userId,
    ],
    queryFn: async () => {
      const res = await axiosV2.get('/admin/challenge/questions', {
        params: { answerStatus, page: page - 1, size, userId },
      });
      return challengeQuestionsResponseSchema.parse(res.data.data);
    },
  });
};

// placeholderQuestion 은 목록에서 넘겨 받은 첫 표시용 값이다. initialData 로 두면
// 서버 값과 구분되지 않아서, 서버 응답이 오기 전까지 isPlaceholderData 로 구분한다.
export const useChallengeQuestionQuery = (
  challengeId: number,
  questionId: number,
  placeholderQuestion?: ChallengeQuestionItem,
) => {
  return useQuery({
    queryKey: [
      CHALLENGE_QUESTIONS_QUERY_KEY,
      'detail',
      challengeId,
      questionId,
    ],
    queryFn: async () => {
      const res = await axiosV2.get(
        `/admin/challenge/${challengeId}/questions/${questionId}`,
      );
      return challengeQuestionItemSchema.parse(res.data.data);
    },
    placeholderData: placeholderQuestion,
  });
};

export const useAnswerQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      challengeId,
      questionId,
      answer,
    }: {
      challengeId: number;
      questionId: number;
      answer: string;
    }) =>
      axiosV2.patch(
        `/admin/challenge/${challengeId}/questions/${questionId}/answer`,
        { answer },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CHALLENGE_QUESTIONS_QUERY_KEY],
      });
    },
  });
};

export const useToggleVisibilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      challengeId,
      questionId,
      isVisible,
    }: {
      challengeId: number;
      questionId: number;
      isVisible: boolean;
    }) =>
      axiosV2.patch(
        `/admin/challenge/${challengeId}/questions/${questionId}/visibility`,
        { isVisible },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CHALLENGE_QUESTIONS_QUERY_KEY],
      });
    },
  });
};

export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      challengeId,
      questionId,
    }: {
      challengeId: number;
      questionId: number;
    }) =>
      axiosV2.delete(
        `/admin/challenge/${challengeId}/questions/${questionId}/answer`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CHALLENGE_QUESTIONS_QUERY_KEY],
      });
    },
  });
};
