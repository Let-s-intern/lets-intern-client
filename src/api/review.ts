import { challengeTypeSchema, pageInfo } from '@/schema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { mypageApplicationsSchema } from './application';

export const getAllApplicationsForReviewQueryKey = ['applications', 'review'];

export const useGetAllApplicationsForReviewQuery = () => {
  return useQuery({
    queryKey: getAllApplicationsForReviewQueryKey,
    queryFn: async () => {
      const res = await axios.get('/user/review/applications');
      return mypageApplicationsSchema.parse(res.data.data).applicationList;
    },
  });
};

export const reviewTypeSchema = z.enum([
  'CHALLENGE_REVIEW',
  'LIVE_REVIEW',
  'VOD_REVIEW',
  'REPORT_REVIEW',
  'MISSION_REVIEW',
]);

export const questionTypeSchema = z.enum([
  'GOAL',
  'GOAL_RESULT',
  'WORRY',
  'WORRY_RESULT',
]);

export type ReviewType = z.infer<typeof reviewTypeSchema>;

export type QuestionType = z.infer<typeof questionTypeSchema>;

export const reviewItemSchema = z.object({
  reviewItemId: z.number(),
  questionType: questionTypeSchema.nullable().optional(),
  answer: z.string().nullable().optional(),
});

export type ReviewItem = z.infer<typeof reviewItemSchema>;

export const getReviewSchema = z.object({
  reviewInfo: z.object({
    reviewId: z.number(),
    type: reviewTypeSchema,
    createDate: z.string().nullable().optional(),
    goodPoint: z.string().nullable().optional(),
    badPoint: z.string().nullable().optional(),
    programTitle: z.string().nullable().optional(),
    programThumbnail: z.string().nullable().optional(),
    challengeType: challengeTypeSchema.nullable().optional(),
    missionTitle: z.string().nullable().optional(),
    missionTh: z.number().nullable().optional(),
    name: z.string().nullable().optional(), // 이름
    wishJob: z.string().nullable().optional(), // 희망직무
    wishCompany: z.string().nullable().optional(), // 희망산업
  }),
  reviewItemList: z.array(reviewItemSchema).nullable().optional(),
});

export type GetReview = z.infer<typeof getReviewSchema>;

export const reviewListSchema = z.object({
  reviewList: z.array(getReviewSchema),
  pageInfo,
});
