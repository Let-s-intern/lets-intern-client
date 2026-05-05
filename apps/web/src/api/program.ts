import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { client } from '@/utils/client';
import {
  ChallengeIdSchema,
  CreateChallengeReq,
  CreateGuidebookReq,
  CreateLiveReq,
  CreateReviewV2Req,
  CreateVodReq,
  faqSchema,
  getChallengeIdPrimitiveSchema,
  getChallengeIdSchema,
  getGuidebookIdSchema,
  getLiveIdPrimitiveSchema,
  getLiveIdSchema,
  getPublicGuidebookSchema,
  getPublicVodSchema,
  getVodIdSchema,
  LiveApplicantListSchema,
  LiveApplicationFormSchema,
  LiveContent,
  LiveContentSchema,
  LiveHistory,
  LiveHistorySchema,
  LiveIdPrimitive,
  LiveIdSchema,
  LiveMentorContentSchema,
  LiveMentorPasswordSchema,
  LiveReviewListSchema,
  LiveThumbnail,
  LiveThumbnailSchema,
  LiveTitle,
  liveTitleSchema,
  Program,
  programAdminSchema,
  programBannerAdminDetailSchema,
  programBannerAdminListSchema,
  programBannerUserListSchema,
  ProgramClassification,
  ProgramRecommend,
  programRecommendSchema,
  programSchema,
  ProgramStatus,
  ProgramStatusEnum,
  ProgramTypeEnum,
  ProgramTypeUpperCase,
  PublicGuidebookSchema,
  PublicVodSchema,
  ReviewV2ListSchema,
  UpdateChallengeReq,
  UpdateGuidebookReq,
  UpdateLiveReq,
  UpdateVodReq,
} from '../schema';
import { IPageable } from '../types/interface';
import axios from '../utils/axios';

export const useProgramQuery = ({
  programId,
  type,
}: {
  type: 'live' | 'vod' | 'challenge' | 'guidebook';
  programId: number;
}) => {
  const liveQuery = useGetLiveQuery({
    liveId: programId,
    enabled: type === 'live' && programId !== -1,
  });

  const challengeQuery = useGetChallengeQuery({
    challengeId: programId,
    enabled: type === 'challenge' && programId !== -1,
  });

  const guidebookQuery = useQuery({
    enabled: type === 'guidebook' && programId !== -1,
    queryKey: ['publicGuidebook', programId],
    queryFn: async () => {
      const res = await axios.get(`/guidebooks/${programId}`);
      return getPublicGuidebookSchema.parse(res.data.data);
    },
  });

  const vodQuery = useQuery({
    enabled: type === 'vod' && programId !== -1,
    queryKey: ['publicVod', programId],
    queryFn: async () => {
      const res = await axios.get(`/vods/${programId}`);
      return getPublicVodSchema.parse(res.data.data);
    },
  });

  switch (type) {
    case 'live':
      return {
        type: 'live' as const,
        query: liveQuery,
      };
    case 'vod':
      return {
        type: 'vod' as const,
        query: vodQuery,
      };
    case 'challenge':
      return {
        type: 'challenge' as const,
        query: challengeQuery,
      };
    case 'guidebook':
      return {
        type: 'guidebook' as const,
        query: guidebookQuery,
      };
  }
};

export type ProgramQuery = ReturnType<typeof useProgramQuery>;

// 레거시(챌린지/라이브) 전용 프로그램 조회 훅
export const useLegacyProgramQuery = (args: {
  type: 'live' | 'challenge';
  programId: number;
}) => {
  return useProgramQuery(args);
};

export const useUserProgramQuery = ({
  pageable,
  searchParams,
}: {
  pageable: IPageable;
  searchParams: URLSearchParams;
}) => {
  return useQuery({
    queryKey: [useUserProgramQuery, pageable.page, searchParams.toString()],
    queryFn: async () => {
      const pageableQuery = Object.entries({
        ...pageable,
      })?.map(([key, value]) => `${key}=${value}`);

      const res = await axios.get(
        `/program?${pageableQuery.join('&')}&${searchParams.toString()}`,
      );

      return programSchema.parse(res.data.data);
    },
  });
};

export const useGetProgramAdminQueryKey = 'useGetProgramAdminQueryKey';

export const useGetUserProgramQuery = ({
  pageable,
  searchParams,
}: {
  pageable: IPageable;
  searchParams: {
    type?: ProgramTypeUpperCase;
    status?: ProgramStatus[];
    classification?: ProgramClassification[];
    startDate?: string;
    endDate?: string;
  };
}) => {
  return useQuery({
    queryKey: [useGetProgramAdminQueryKey, pageable, searchParams],
    queryFn: async () => {
      const res = await axios.get(`/program`, {
        params: {
          status: searchParams.status?.join(','),
          classification: searchParams.classification?.join(','),
          type: searchParams.type,
          startDate: searchParams.startDate,
          endDate: searchParams.endDate,
          ...pageable,
        },
      });

      return programSchema.parse(res.data.data);
    },
  });
};

export const useGetProgramAdminQuery = (params: {
  type?: ProgramTypeUpperCase;
  classification?: ProgramClassification;
  status?: ProgramStatus[];
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  page: number | string;
  size: number | string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [useGetProgramAdminQueryKey, params],
    queryFn: async () => {
      const { enabled: _enabled, ...apiParams } = params;
      const res = await axios.get(`/program/admin`, {
        params: { ...apiParams, status: params.status?.join(',') },
      });
      return programAdminSchema.parse(res.data.data);
    },
    enabled: params.enabled,
  });
};

export const useGetProgramRecommend = () => {
  return useQuery({
    queryKey: ['useGetProgramRecommend'],
    queryFn: async () => {
      const res = await axios.get(`/program/recommend`);
      return programRecommendSchema.parse(res.data.data);
    },
  });
};

export const useGetChallengeQueryKey = 'challenge';

export const useGetChallengeQuery = ({
  challengeId,
  enabled,
  refetchOnWindowFocus = true,
}: {
  challengeId: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}) => {
  return useQuery({
    enabled,
    refetchOnWindowFocus,
    queryKey: [useGetChallengeQueryKey, challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}`);
      return getChallengeIdSchema.parse(res.data.data);
    },
  });
};

/** 1회용으로 사용하기 위한 함수 */
export const getChallenge = async (challengeId: number) => {
  const res = await axios.get(`/challenge/${challengeId}`);
  return getChallengeIdSchema.parse(res.data.data);
};

export const usePostChallengeMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: CreateChallengeReq) => {
      const res = await axios.post(`/challenge`, data);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

/** 챌린지 상세 조회 */
export const useChallengeQuery = (challengeId?: string | number) => {
  return useQuery({
    queryKey: ['useChallengeQuery', challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}`);
      return getChallengeIdPrimitiveSchema.parse(res.data.data);
    },
    enabled: !!challengeId,
  });
};

export const usePatchChallengeMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: UpdateChallengeReq & { challengeId: number }) => {
      const { challengeId, ...rest } = data;
      const res = await axios.patch(`/challenge/${challengeId}`, rest);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useDeleteChallengeMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (challengeId: number) => {
      const res = await axios.delete(`/challenge/${challengeId}`);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useGetLiveQueryKey = 'useGetLiveQueryKey';

export const useGetLiveQuery = ({
  liveId,
  enabled,
}: {
  liveId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetLiveQueryKey, liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}`);
      return getLiveIdSchema.parse(res.data.data);
    },
  });
};

export const fetchLiveData = async (
  liveId: string,
): Promise<LiveIdPrimitive> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/live/${liveId}`,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch live data');
  }

  const data = await res.json();
  return getLiveIdPrimitiveSchema.parse(data.data);
};

/** 1회용으로 사용하기 위한 함수 */
export const getLive = async (liveId: number) => {
  const res = await axios.get(`/live/${liveId}`);
  return getLiveIdSchema.parse(res.data.data);
};

export const usePostLiveMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: CreateLiveReq) => {
      const res = await axios.post(`/live`, data);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const usePatchLiveMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: UpdateLiveReq & { liveId: number }) => {
      const { liveId, ...rest } = data;
      const res = await axios.patch(`/live/${liveId}`, rest);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useDeleteLiveMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (liveId: number) => {
      const res = await axios.delete(`/live/${liveId}`);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useGetLiveFaq = (liveId: number | string) => {
  return useQuery({
    queryKey: ['useGetLiveFaq', liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}/faqs`);
      return faqSchema.parse(res.data.data);
    },
  });
};

// ---------------------------------------------------------------------------
// 라이브 신규 엔드포인트 훅 (PRD-서면라이브 분리, Push 1)
// 본 Push 는 훅 정의만 추가하며 UI 는 변경하지 않는다.
//
// apps/admin/src/api/program.ts 와 동일 시그니처를 유지한다.
// 웹은 RSC 우선이므로 단건 fetch 헬퍼(fetchLiveContent / fetchLiveTitle /
// fetchLiveThumbnail / fetchLiveHistory)도 함께 export 한다.
// ---------------------------------------------------------------------------

export const useGetLiveContentQueryKey = 'useGetLiveContentQueryKey';

/** GET /api/v1/live/{liveId}/content — 라이브 상세 본문 */
export const useGetLiveContentQuery = ({
  liveId,
  enabled,
}: {
  liveId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetLiveContentQueryKey, liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}/content`);
      return LiveContentSchema.parse(res.data.data);
    },
  });
};

export const useGetLiveTitleQueryKey = 'useGetLiveTitleQueryKey';

/** GET /api/v1/live/{liveId}/title — 라이브 타이틀 (SEO/메타) */
export const useGetLiveTitleQuery = ({
  liveId,
  enabled,
}: {
  liveId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetLiveTitleQueryKey, liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}/title`);
      return liveTitleSchema.parse(res.data.data);
    },
  });
};

export const useGetLiveThumbnailQueryKey = 'useGetLiveThumbnailQueryKey';

/** GET /api/v1/live/{liveId}/thumbnail — 라이브 썸네일 */
export const useGetLiveThumbnailQuery = ({
  liveId,
  enabled,
}: {
  liveId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetLiveThumbnailQueryKey, liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}/thumbnail`);
      return LiveThumbnailSchema.parse(res.data.data);
    },
  });
};

export const useGetLiveApplicationFormQueryKey =
  'useGetLiveApplicationFormQueryKey';

/** GET /api/v1/live/{liveId}/application — 라이브 신청폼 조회 */
export const useGetLiveApplicationFormQuery = ({
  liveId,
  enabled,
}: {
  liveId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetLiveApplicationFormQueryKey, liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}/application`);
      return LiveApplicationFormSchema.parse(res.data.data);
    },
  });
};

export const useGetLiveHistoryQueryKey = 'useGetLiveHistoryQueryKey';

/** GET /api/v1/live/{liveId}/history — 신청 여부 조회 */
export const useGetLiveHistoryQuery = ({
  liveId,
  enabled,
}: {
  liveId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetLiveHistoryQueryKey, liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}/history`);
      return LiveHistorySchema.parse(res.data.data);
    },
  });
};

export const useGetLiveApplicantsQueryKey = 'useGetLiveApplicantsQueryKey';

/** GET /api/v1/live/{liveId}/applications — [어드민] 신청자 목록 */
export const useGetLiveApplicantsQuery = ({
  liveId,
  enabled,
}: {
  liveId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetLiveApplicantsQueryKey, liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}/applications`);
      return LiveApplicantListSchema.parse(res.data.data);
    },
  });
};

export const useGetLiveReviewsAdminQueryKey =
  'useGetLiveReviewsAdminQueryKey';

/** GET /api/v1/live/{liveId}/reviews — [어드민] 신청자 리뷰 */
export const useGetLiveReviewsAdminQuery = ({
  liveId,
  enabled,
}: {
  liveId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetLiveReviewsAdminQueryKey, liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}/reviews`);
      return LiveReviewListSchema.parse(res.data.data);
    },
  });
};

export const useGetLiveReviewsQueryKey = 'useGetLiveReviewsQueryKey';

/** GET /api/v1/live/reviews — 라이브 리뷰 (전체) */
export const useGetLiveReviewsQuery = ({
  enabled,
}: { enabled?: boolean } = {}) => {
  return useQuery({
    enabled,
    queryKey: [useGetLiveReviewsQueryKey],
    queryFn: async () => {
      const res = await axios.get(`/live/reviews`);
      return LiveReviewListSchema.parse(res.data.data);
    },
  });
};

export const useGetLiveMentorPasswordQueryKey =
  'useGetLiveMentorPasswordQueryKey';

/** GET /api/v1/live/{liveId}/mentor — [어드민] 멘토 비밀번호 */
export const useGetLiveMentorPasswordQuery = ({
  liveId,
  enabled,
}: {
  liveId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetLiveMentorPasswordQueryKey, liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}/mentor`);
      return LiveMentorPasswordSchema.parse(res.data.data);
    },
  });
};

export const useGetLiveMentorContentQueryKey =
  'useGetLiveMentorContentQueryKey';

/** GET /api/v1/live/{liveId}/mentor/{password} — [어드민] 멘토 전달 내용 */
export const useGetLiveMentorContentQuery = ({
  liveId,
  password,
  enabled,
}: {
  liveId: number;
  password: string;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetLiveMentorContentQueryKey, liveId, password],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}/mentor/${password}`);
      return LiveMentorContentSchema.parse(res.data.data);
    },
  });
};

export const useGetReviewListV2QueryKey = 'useGetReviewListV2QueryKey';

/** GET /api/v2/review — 후기 전체 조회 (challenge, mission, live, report) */
export const useGetReviewListV2Query = ({
  params,
  enabled,
}: {
  params?: Record<string, string | number | boolean | undefined>;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    enabled,
    queryKey: [useGetReviewListV2QueryKey, params],
    queryFn: async () => {
      const res = await axios.get(`/v2/review`, { params });
      return ReviewV2ListSchema.parse(res.data.data);
    },
  });
};

/** POST /api/v2/review — 후기 생성 (challenge, live, report) */
export const usePostReviewV2Mutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: CreateReviewV2Req) => {
      const res = await axios.post(`/v2/review`, data);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

// ---------------------------------------------------------------------------
// RSC 용 단건 fetch 헬퍼 (Next.js Server Components 에서 직접 호출)
// 기존 fetchLiveData 와 동일한 패턴: process.env.NEXT_PUBLIC_SERVER_API + fetch
// ---------------------------------------------------------------------------

/** GET /api/v1/live/{liveId}/content — RSC 용 */
export const fetchLiveContent = async (
  liveId: string | number,
  init?: RequestInit,
): Promise<LiveContent> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/live/${liveId}/content`,
    init,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch live content');
  }

  const data = await res.json();
  return LiveContentSchema.parse(data.data);
};

/** GET /api/v1/live/{liveId}/title — RSC 용 (SEO/메타) */
export const fetchLiveTitle = async (
  liveId: string | number,
  init?: RequestInit,
): Promise<LiveTitle> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/live/${liveId}/title`,
    init,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch live title');
  }

  const data = await res.json();
  return liveTitleSchema.parse(data.data);
};

/** GET /api/v1/live/{liveId}/thumbnail — RSC 용 */
export const fetchLiveThumbnail = async (
  liveId: string | number,
  init?: RequestInit,
): Promise<LiveThumbnail> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/live/${liveId}/thumbnail`,
    init,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch live thumbnail');
  }

  const data = await res.json();
  return LiveThumbnailSchema.parse(data.data);
};

/** GET /api/v1/live/{liveId}/history — RSC 용 (auth 헤더 필요)
 *  사용자별 신청 여부 조회이므로 호출 측에서 Authorization 헤더를 init.headers 로 전달한다.
 */
export const fetchLiveHistory = async (
  liveId: string | number,
  init?: RequestInit,
): Promise<LiveHistory> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/live/${liveId}/history`,
    init,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch live history');
  }

  const data = await res.json();
  return LiveHistorySchema.parse(data.data);
};

export const useGetGuidebookQueryKey = 'useGetGuidebookQueryKey';

export const useGetGuidebookQuery = ({
  guidebookId,
  enabled,
}: {
  guidebookId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetGuidebookQueryKey, guidebookId],
    queryFn: async () => {
      const res = await axios.get(`/guidebook/${guidebookId}`);
      return getGuidebookIdSchema.parse(res.data.data);
    },
  });
};

/** GET /api/v1/guidebooks/{guidebookId} 가이드북 상세 조회 (유저용: 자료정보 X) */
export const fetchPublicGuidebookData = async (
  guidebookId: string,
): Promise<PublicGuidebookSchema> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/guidebooks/${guidebookId}`,
  );

  if (!res.ok) {
    throw new Error('가이드북 상세 조회에 실패했습니다.');
  }

  const data = await res.json();
  return getPublicGuidebookSchema.parse(data.data);
};

/** 1회용으로 사용하기 위한 함수 */
export const getGuidebook = async (guidebookId: number) => {
  const res = await axios.get(`/guidebook/${guidebookId}`);
  return getGuidebookIdSchema.parse(res.data.data);
};

export const usePostGuidebookMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: CreateGuidebookReq) => {
      const res = await axios.post(`/guidebook`, data);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const usePatchGuidebookMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: UpdateGuidebookReq & { guidebookId: number }) => {
      const { guidebookId, ...rest } = data;
      const res = await axios.patch(`/guidebook/${guidebookId}`, rest);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

/** DELETE /guidebook/{id} 가이드북 삭제 */
export const useDeleteGuidebookMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (guidebookId: number) => {
      const res = await axios.delete(`/guidebook/${guidebookId}`);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useGetVodQueryKey = 'useGetVodQueryKey';

export const useGetVodQuery = ({
  vodId,
  enabled,
}: {
  vodId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetVodQueryKey, vodId],
    queryFn: async () => {
      const res = await axios.get(`/vod/${vodId}`);
      return getVodIdSchema.parse(res.data.data);
    },
  });
};

/** 1회용으로 사용하기 위한 함수 (어드민) */
export const getVod = async (vodId: number) => {
  const res = await axios.get(`/vod/${vodId}`);
  return getVodIdSchema.parse(res.data.data);
};

/** GET /api/v1/vods/{vodId} VOD 상세 조회 (사용자용: 자료정보 X) */
export const fetchPublicVodData = async (
  vodId: string,
): Promise<PublicVodSchema> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/vods/${vodId}`,
  );

  if (!res.ok) {
    throw new Error('VOD 상세 조회에 실패했습니다.');
  }

  const data = await res.json();
  return getPublicVodSchema.parse(data.data);
};

export const usePostVodMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: CreateVodReq) => {
      const res = await axios.post(`/vod`, data);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const usePatchVodMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: UpdateVodReq & { vodId: number }) => {
      const { vodId, ...rest } = data;
      const res = await axios.patch(`/vod/${vodId}`, rest);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useDeleteVodMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (vodId: number) => {
      const res = await axios.delete(`/vod/${vodId}`);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useGetLiveTitle = (liveId: number | string) => {
  return useQuery({
    queryKey: [liveId, 'useGetLiveTitle'],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}/title`);
      return liveTitleSchema.parse(res.data.data);
    },
  });
};

// 프로그램 배너 목록 조회
const getProgramBannerListQueryKey = ['useGetProgramBannerListQueryKey'];

export const useGetProgramBannerListQuery = () => {
  return useQuery({
    queryKey: getProgramBannerListQueryKey,
    queryFn: async () => {
      const res = await axios.get('/banner/admin', {
        params: {
          type: 'PROGRAM',
        },
      });
      return programBannerAdminListSchema.parse(res.data.data);
    },
  });
};

// 유저단 프로그램 배너 목록 조회
const getUserProgramBannerListQueryKey = [
  'useGetUserProgramBannerListQueryKey',
];

export const useGetUserProgramBannerListQuery = () => {
  return useQuery({
    queryKey: getUserProgramBannerListQueryKey,
    queryFn: async () => {
      const res = await axios.get('/banner', {
        params: {
          type: 'PROGRAM',
        },
      });
      return programBannerUserListSchema.parse(res.data.data);
    },
  });
};

// 프로그램 배너 상세 조회
export const getProgramBannerDetailQueryKey = (bannerId: number) => [
  'banner',
  'admin',
  bannerId,
];

export const useGetProgramBannerDetailQuery = (bannerId: number) => {
  return useQuery({
    queryKey: getProgramBannerDetailQueryKey(bannerId),
    queryFn: async () => {
      const res = await axios.get(`/banner/admin/${bannerId}`, {
        params: {
          type: 'PROGRAM',
        },
      });
      return programBannerAdminDetailSchema.parse(res.data.data);
    },
  });
};

// 프로그램 배너 등록
export const useCreateProgramBannerMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post('/banner', formData, {
        params: {
          type: 'PROGRAM',
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...getProgramBannerListQueryKey],
      });
      return onSuccess && onSuccess();
    },
    onError: (error) => {
      return onError && onError(error);
    },
  });
};

// 프로그램 배너 수정
export const useEditProgramBannerMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bannerId,
      formData,
    }: {
      bannerId: number;
      formData: FormData;
    }) => {
      const res = await axios.patch(`/banner/${bannerId}`, formData, {
        params: {
          type: 'PROGRAM',
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: res.data, bannerId };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: getProgramBannerDetailQueryKey(data.bannerId),
      });
      await queryClient.invalidateQueries({
        queryKey: getProgramBannerListQueryKey,
      });
      return onSuccess && onSuccess();
    },
    onError: (error) => {
      return onError && onError(error);
    },
  });
};

// 프로그램 배너 삭제
export const useDeleteProgramBannerMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bannerId: number) => {
      const res = await axios.delete(`/banner/${bannerId}`, {
        params: {
          type: 'PROGRAM',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...getProgramBannerListQueryKey],
      });
      return onSuccess && onSuccess();
    },
    onError: (error) => {
      return onError && onError(error);
    },
  });
};

export const fetchChallenge = async (
  id: string | number,
): Promise<ChallengeIdSchema> => {
  const data = await client<ChallengeIdSchema>(`/v1/challenge/${id}`, {
    method: 'GET',
  });
  return getChallengeIdSchema.parse(data);
};

export const fetchLive = async (id: string | number): Promise<LiveIdSchema> => {
  const data = await client<LiveIdSchema>(`/v1/live/${id}`, {
    method: 'GET',
  });
  return getLiveIdSchema.parse(data);
};

export const fetchProgram = async (params: {
  type?: ProgramTypeUpperCase[];
  classification?: ProgramClassification[];
  status?: ProgramStatus[];
  startDate?: string;
  endDate?: string;
  page: number | string;
  size: number | string;
}): Promise<Program> => {
  const data = await client<Program>('/v1/program', {
    method: 'GET',
    params: {
      ...params,
      type: params.type?.join(',') ?? '',
      classification: params.classification?.join(',') ?? '',
      status: params.status?.join(',') ?? '',
      page: String(params.page),
      size: String(params.size),
    },
  });

  return programSchema.parse(data);
};

export const getChallengeByKeyword = async (keyword: string) => {
  // 챌린지 가져오기
  const programs = await fetchProgram({
    page: 1,
    size: 10,
    type: [ProgramTypeEnum.enum.CHALLENGE],
    status: [ProgramStatusEnum.enum.PROCEEDING],
  });

  const filtered = programs.programList.filter((item) =>
    item.programInfo.title?.includes(keyword),
  );

  if (filtered.length === 0) return undefined;

  // 모집 마감일 제일 빠른 챌린지 찾기
  filtered.sort(
    (a, b) =>
      new Date(a.programInfo.deadline ?? '').getTime() -
      new Date(b.programInfo.deadline ?? '').getTime(),
  );

  return filtered[0];
};

export const fetchProgramRecommend = async () => {
  const data = await client<ProgramRecommend>('/v1/program/recommend', {
    method: 'GET',
  });
  return programRecommendSchema.parse(data);
};
