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
}: {
  answerStatus?: AnswerStatus;
  page: number;
  size: number;
}) => {
  return useQuery({
    queryKey: [CHALLENGE_QUESTIONS_QUERY_KEY, 'all', answerStatus, page, size],
    queryFn: async () => {
      const res = await axiosV2.get('/admin/challenge/questions', {
        params: { answerStatus, page: page - 1, size },
      });
      return challengeQuestionsResponseSchema.parse(res.data.data);
    },
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
