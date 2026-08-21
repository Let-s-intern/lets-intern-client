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
  imageUrls: z.array(z.string()).optional().default([]),
  // 서버 배포 전이면 필드가 없다. 없으면 안 읽음으로 본다
  isAnswerRead: z.boolean().optional().default(false),
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
    // imageUrls 는 플로팅 패널에서만 보낸다. 기존 /inquiry 페이지는 안 보낸다
    mutationFn: (body: {
      title: string;
      content: string;
      imageUrls?: string[];
    }) => axios.post(`/challenge/${challengeId}/questions`, body),
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

/** 공개된 답변을 확인했다고 서버에 표시한다 */
export const useMarkQuestionReadMutation = (challengeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: number) =>
      axios.patch(`/challenge/${challengeId}/questions/${questionId}/read`),
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
