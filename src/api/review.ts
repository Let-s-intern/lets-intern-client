import {
  ChallengeType,
  challengeTypeSchema,
  pageInfo,
  ProgramTypeEnum,
  ProgramTypeUpperCase,
  reportTypeSchema,
} from '@/schema';
import axios from '@/utils/axios';
import axiosV2 from '@/utils/axiosV2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { mypageApplicationsSchema } from './application';
import { getChallengeReviewStatusQueryKey } from './challenge';
import { blogBonusSchema, PostBlogBonusRequest } from './reviewSchema';

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
  'GOOD_POINT',
  'BAD_POINT',
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
    programId: z.number().nullable().optional(),
    programTitle: z.string().nullable().optional(),
    programThumbnail: z.string().nullable().optional(),
    challengeType: challengeTypeSchema.nullable().optional(),
    reportType: reportTypeSchema.nullable().optional(),
    missionTitle: z.string().nullable().optional(),
    missionTh: z.number().nullable().optional(),
    attendanceReview: z.string().nullable().optional(), // 미션 수행 후기
    name: z.string().nullable().optional(), // 이름
    wishJob: z.string().nullable().optional(), // 희망직무
    wishCompany: z.string().nullable().optional(), // 희망기업
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
      const res = await axiosV2.get(`/review/blog`, {
        params: { page, size, type: types.join(',') },
      });

      return blogReviewListSchema.parse(res.data.data);
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
  reviewItemList: PostReviewItemType[];
};

/**
 * @description : USER 프로그램 리뷰 등록
 * @param param: errorCallback, successCallback
 * @returns : 프로그램 리뷰 등록
 */
export const usePostReviewMutation = ({
  challengeId,
  errorCallback,
  successCallback,
}: {
  challengeId?: number;
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
      if (challengeId) {
        client.invalidateQueries({
          queryKey: getChallengeReviewStatusQueryKey(challengeId),
        });
      }
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
  liveJob?: string[];
  page?: number;
  size?: number;
};

// USER 프로그램 리뷰 리스트 조회 쿼리 키
const getProgramReviewQueryKey = (param?: programReviewParam) => [
  'programReview',
  { ...param },
];

/**
 * @description : USER 프로그램 리뷰 리스트 조회
 * @param param : types, challengeTypes, page, size
 * @returns : 프로그램 리뷰 리스트
 */
export const useGetProgramReview = ({
  types,
  challengeTypes,
  liveJob,
  page = 1,
  size = 10,
}: programReviewParam) => {
  return useQuery({
    queryKey: getProgramReviewQueryKey({
      types,
      challengeTypes,
      liveJob,
      page,
      size,
    }),
    queryFn: async () => {
      const res = await axiosV2.get('/review', {
        params: {
          type: types ? types.join(',') : undefined,
          challengeType: challengeTypes ? challengeTypes.join(',') : undefined,
          liveJob: liveJob ? liveJob.join(',') : undefined,
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
    description: z.string().optional().nullable(),
    url: z.string().optional().nullable(),
    thumbnail: z.string().optional().nullable(),
    isVisible: z.boolean().optional().nullable(),
    phoneNum: z.string().nullish(),
    accountType: z.string().nullish(),
    accountNum: z.string().nullish(),
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
  description?: string | null;
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
  programType?: ProgramTypeUpperCase;
  programTitle?: string | null;
  name?: string | null;
  url?: string | null;
  postDate?: string | null;
  isVisible?: boolean;
}

export const usePatchAdminBlogReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedReview: AdminBlogReviewPatchReq) => {
      const res = await axiosV2.patch(
        `/admin/review/blog/${updatedReview.blogReviewId}`,
        updatedReview,
      );
      return res;
    },
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: [adminBlogReviewListQueryKey],
      }),
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

export const adminReviewItemSchema = z.object({
  reviewItemId: z.number(),
  questionType: questionTypeSchema.nullable().optional(),
  answer: z.string().nullable().optional(),
  isVisible: z.boolean().nullable().optional(),
});

export const adminProgramReviewSchema = z.object({
  reviewInfo: z.object({
    reviewId: z
      .number()
      .nullable()
      .optional()
      .transform((data) => data ?? 0),
    attendanceId: z.number().nullable().optional(),
    createDate: z.string().nullable().optional(),
    challengeType: challengeTypeSchema.nullable().optional(),
    challengeTitle: z.string().nullable().optional(),
    missionTh: z.number().nullable().optional(),
    missionTitle: z.string().nullable().optional(),
    reportType: reportTypeSchema.nullable().optional(),
    title: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    review: z.string().nullable().optional(),
    score: z.number().nullable().optional(),
    npsScore: z.number().nullable().optional(),
    isVisible: z.boolean().nullable().optional(),
    reviewIsVisible: z.boolean().nullable().optional(),
  }),
  reviewItemList: z.array(adminReviewItemSchema).nullable().optional(),
});

export type AdminProgramReview = z.infer<typeof adminProgramReviewSchema>;

export const adminProgramReviewListSchema = z.object({
  reviewList: z.array(adminProgramReviewSchema),
});

// ADMIN 프로그램 리뷰 리스트 조회
export const getAdminProgramReviewQueryKey = (type: ReviewType) => [
  'admin',
  'review',
  type,
];

/**
 * @description : ADMIN 프로그램 리뷰 리스트 조회
 * @param param : type
 * @returns : ADMIN 프로그램 리뷰 리스트 조회
 */
export const useGetAdminProgramReview = ({ type }: { type: ReviewType }) => {
  return useQuery({
    queryKey: getAdminProgramReviewQueryKey(type),
    queryFn: async () => {
      const res = await axiosV2.get(`/admin/review/${type}`);
      return adminProgramReviewListSchema.parse(res.data.data);
    },
  });
};

/**
 * @description : ADMIN 프로그램 리뷰 노출여부 변경
 * @param param : type, reviewId, isVisible
 * @returns : ADMIN 프로그램 리뷰 노출여부 변경
 */
export const useUpdateAdminProgramReview = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      type,
      reviewId,
      isVisible,
    }: {
      type: ReviewType;
      reviewId: number;
      isVisible: boolean;
    }) => {
      await axiosV2.patch(`/admin/review/${type}/${reviewId}`, {
        isVisible,
      });

      return { type, reviewId, isVisible };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: getAdminProgramReviewQueryKey(data.type),
      });
      return successCallback && successCallback();
    },
    onError: (error: Error) => {
      return errorCallback && errorCallback(error);
    },
  });
};

/**
 * @description : ADMIN 프로그램 리뷰 아이템 노출여부 업데이트
 * @param param : type, reviewItemId, isVisible
 * @returns : ADMIN 프로그램 리뷰 아이템 노출여부 업데이트
 */
export const useUpdateAdminProgramReviewItem = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      type,
      reviewItemId,
      isVisible,
    }: {
      type: ReviewType;
      reviewItemId: number;
      isVisible: boolean;
    }) => {
      await axiosV2.patch(`/admin/review/item/${reviewItemId}`, {
        isVisible,
      });

      return { type, reviewItemId, isVisible };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: getAdminProgramReviewQueryKey(data.type),
      });
      return successCallback && successCallback();
    },
    onError: (error: Error) => {
      return errorCallback && errorCallback(error);
    },
  });
};

const reviewCountSchema = z.object({
  count: z.number().int().nonnegative(),
});

/**
 * @description : USER 후기 전체 개수 조회
 */
export const useGetReviewCount = () => {
  return useQuery({
    queryKey: ['useGetReviewCount'],
    queryFn: async () => {
      const res = await axiosV2.get(`/review/count`);
      return reviewCountSchema.parse(res.data.data);
    },
  });
};

/** POST 블로그 보너스 미션 후기 제출 /api/v2/review/blog/bonus */
export const usePostBlogBonus = () => {
  return useMutation({
    mutationFn: async (reqBody: PostBlogBonusRequest) => {
      const res = await axiosV2.post(`/review/blog/bonus`, reqBody);
      return blogBonusSchema.parse(res.data.data);
    },
    onError(error) {
      console.error(error);
    },
  });
};
