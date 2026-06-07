import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

const questionItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  answerStatus: z.enum(['WAITING', 'COMPLETED']),
  answer: z.string().nullable(),
  isVisible: z.boolean(),
  createDate: z.string(),
});

export type QuestionItem = z.infer<typeof questionItemSchema>;

const questionsResponseSchema = z.object({
  questionList: z.array(questionItemSchema),
});

export const QUESTION_QUERY_KEY = 'challengeQuestions';
const DEFAULT_INQUIRY_LIMIT = 100;

export const useMyQuestionsQuery = (challengeId: number) =>
  useQuery({
    queryKey: [QUESTION_QUERY_KEY, challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/questions`, {
        params: { size: DEFAULT_INQUIRY_LIMIT },
      });
      return questionsResponseSchema.parse(res.data.data).questionList;
    },
    enabled: !isNaN(challengeId) && challengeId > 0,
  });

export const useCreateQuestionMutation = (challengeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { title: string; content: string }) =>
      axios.post(`/challenge/${challengeId}/questions`, body),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUESTION_QUERY_KEY, challengeId],
      }),
  });
};

export const useEditQuestionMutation = (challengeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      ...body
    }: {
      questionId: number;
      title: string;
      content: string;
    }) =>
      axios.patch(`/challenge/${challengeId}/questions/${questionId}`, body),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUESTION_QUERY_KEY, challengeId],
      }),
  });
};

export const useDeleteQuestionMutation = (challengeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: number) =>
      axios.delete(`/challenge/${challengeId}/questions/${questionId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUESTION_QUERY_KEY, challengeId],
      }),
  });
};
