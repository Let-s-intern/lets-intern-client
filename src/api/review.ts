import {
  ChallengeType,
  challengeTypeSchema,
  pageInfo,
  ProgramTypeEnum,
  ProgramTypeUpperCase,
} from '@/schema';
import axios from '@/utils/axios';
import axiosV2 from '@/utils/axiosV2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
    score: z.number().nullable().optional(),
    npsScore: z.number().nullable().optional(),
    type: reviewTypeSchema.nullable().optional(),
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

export const reviewDetailSchema = z.object({
  reviewInfo: getReviewSchema,
});

const blogReviewSchema = z.object({
  blogReviewId: z.number(),
  postDate: z.string().nullable().optional(),
  programType: ProgramTypeEnum,
  programTitle: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const blogReviewListSchema = z.object({
  reviewList: z.array(blogReviewSchema),
  pageInfo,
});

export type BlogReview = z.infer<typeof blogReviewSchema>;
export type BlogReviewList = z.infer<typeof blogReviewListSchema>;

// 블로그 후기 전체 조회

export const useGetBlogReviewList = ({
  page,
  size,
  types = [],
}: {
  page: number;
  size: number;
  types?: ProgramTypeUpperCase[];
}) => {
  return useQuery({
    queryKey: ['useGetBlogReviewList', ...types, page, size],
    queryFn: async () => {
      const queryString = `page=${page}&size=${size}${types.map((type) => `&type=${type}`).join('')}`;
      const res = await axiosV2.get(`/review/blog?${queryString}`);

      return blogReviewListSchema.parse(res.data.data).reviewList;
    },
  });
};

export type PostReviewItemType = {
  questionType: QuestionType;
  answer: string;
};

export type PostReviewParams = {
  type: ReviewType;
  score: number;
  npsScore: number;
  goodPoint: string;
  badPoint: string;
  reviewItemList: PostReviewItemType[];
};

export const usePostReviewMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      reviewForm,
    }: {
      applicationId: string;
      reviewForm: PostReviewParams;
    }) => {
      await axiosV2.post(`/review?applicationId=${applicationId}`, reviewForm);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: getAllApplicationsForReviewQueryKey,
      });
      return successCallback && successCallback();
    },
    onError: (error: Error) => {
      return errorCallback && errorCallback(error);
    },
  });
};

export type programReviewParam = {
  types?: ReviewType[];
  challengeTypes?: ChallengeType[];
  page?: number;
  size?: number;
};

const getProgramReviewQueryKey = (param?: programReviewParam) => [
  'programReview',
  param?.types,
];

export const useGetProgramReview = ({
  types,
  challengeTypes,
  page = 0,
  size = 10,
}: programReviewParam) => {
  return useQuery({
    queryKey: getProgramReviewQueryKey({ types, challengeTypes, page, size }),
    queryFn: async () => {
      const res = await axiosV2.get('/review', {
        params: {
          type: types ? types.join(',') : undefined,
          challengeType: challengeTypes ? challengeTypes.join(',') : undefined,
          page,
          size,
        },
      });
      return reviewListSchema.parse(res.data.data);
    },
  });
};

export const getProgramReviewDetailQueryKey = (
  type: string,
  reviewId: number,
) => ['programReviewDetail', type, reviewId];

export const useGetProgramReviewDetail = (
  type: ReviewType,
  reviewId: number,
) => {
  return useQuery({
    queryKey: getProgramReviewDetailQueryKey(type, reviewId),
    queryFn: async () => {
      const res = await axiosV2.get(`/review/${type}/${reviewId}`);
      return reviewDetailSchema.parse(res.data.data);
    },
  });
};

export const adminBlogReviewSchema = z
  .object({
    blogReviewId: z.number(),
    postDate: z.string().optional().nullable(),
    programType: ProgramTypeEnum.optional().nullable(),
    programTitle: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    url: z.string().optional().nullable(),
    thumbnail: z.string().optional().nullable(),
    isVisible: z.boolean().optional().nullable(),
  })
  .transform((data) => ({ ...data, postDate: new Date(data.postDate ?? '') }));

export type AdminBlogReview = z.infer<typeof adminBlogReviewSchema>;

export const adminBlogReviewListSchema = z.object({
  reviewList: z.array(adminBlogReviewSchema),
});

// [어드민] 블로그 후기 전체 조회
const adminBlogReviewListQueryKey = 'useGetAdminBlogReviewList';

export const useGetAdminBlogReviewList = () => {
  return useQuery({
    queryKey: [adminBlogReviewListQueryKey],
    queryFn: async () => {
      const res = await axiosV2.get('/admin/review/blog');
      return adminBlogReviewListSchema.parse(res.data.data).reviewList;
    },
    refetchOnWindowFocus: false,
  });
};

// [어드민] 블로그 후기 생성
interface AdminBlogReviewPostReq {
  programType: ProgramTypeUpperCase;
  programTitle?: string | null;
  name?: string | null;
  url?: string | null;
  postDate?: string | null;
}

export const usePostAdminBlogReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newReview: AdminBlogReviewPostReq) => {
      const res = await axiosV2.post('/admin/review/blog', newReview);
      return res;
    },
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: [adminBlogReviewListQueryKey],
      }),
  });
};

// [어드민] 블로그 후기 업데이트
interface AdminBlogReviewPatchReq {
  blogReviewId: number | string;
  programType: ProgramTypeUpperCase;
  programTitle?: string | null;
  name?: string | null;
  url?: string | null;
  postDate?: string | null;
  isVisible: boolean;
}

export const usePatchAdminBlogReview = () => {
  return useMutation({
    mutationFn: async (updatedReview: AdminBlogReviewPatchReq) => {
      const res = await axiosV2.patch(
        `/admin/review/blog/${updatedReview.blogReviewId}`,
        updatedReview,
      );
      return res;
    },
  });
};

// [어드민] 블로그 후기 삭제
export const useDeleteAdminBlogReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogReviewId: number | string) => {
      const res = await axiosV2.delete(`/admin/review/blog/${blogReviewId}`);
      return res;
    },
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: [adminBlogReviewListQueryKey],
      }),
  });
};
