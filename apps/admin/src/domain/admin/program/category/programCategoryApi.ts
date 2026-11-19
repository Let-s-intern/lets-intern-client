import axios from '@/utils/axios';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { z } from 'zod';

/** 노출 분류를 달 수 있는 대상. 서버 ProgramCategoryTargetType 과 같다 */
export type ProgramCategoryTargetType =
  | 'CHALLENGE'
  | 'LIVE'
  | 'VOD'
  | 'GUIDEBOOK'
  | 'LIVE_MENTORING'
  | 'MEMBERSHIP'
  | 'BLOG'
  | 'MAGNET';

export const programCategoryTargetTypeLabel: Record<
  ProgramCategoryTargetType,
  string
> = {
  CHALLENGE: '챌린지',
  LIVE: 'LIVE 클래스',
  VOD: 'VOD 클래스',
  GUIDEBOOK: '가이드북',
  LIVE_MENTORING: '1:1 LIVE 멘토링',
  MEMBERSHIP: '올인원 패스',
  BLOG: '블로그',
  MAGNET: '마그넷',
};

const programCategorySchema = z.object({
  id: z.number(),
  title: z.string(),
  sortOrder: z.number(),
  isVisible: z.boolean(),
});

const targetTypeSchema = z.enum([
  'CHALLENGE',
  'LIVE',
  'VOD',
  'GUIDEBOOK',
  'LIVE_MENTORING',
  'MEMBERSHIP',
  'BLOG',
  'MAGNET',
]);

/** 랜딩 섹션 표시 방식. 서버 ProgramCategoryDisplayType 과 같다 */
export const displayTypeLabel = {
  AUTO: '자동 (상품 유형에 맞춰)',
  FEATURED: '큰 카드 1장',
  CARDS: '카드 목록',
  MENTOR: '멘토 카드',
  BLOG: '블로그 카드',
} as const;
export type ProgramCategoryDisplayType = keyof typeof displayTypeLabel;

const programCategoryItemSchema = programCategorySchema.extend({
  programCount: z.number(),
  // 이전 서버 응답에는 없어서 nullish
  slug: z.string().nullish(),
  directTargetType: targetTypeSchema.nullish(),
  directTargetId: z.number().nullish(),
  displayType: z
    .enum(['AUTO', 'FEATURED', 'CARDS', 'MENTOR', 'BLOG'])
    .nullish(),
  description: z.string().nullish(),
  sourceCategoryIds: z.array(z.number()).nullish(),
  // 프로그램 분류 = 랜딩 페이지의 메뉴·상단 문구 (서버 LC-3626 부터)
  showInMenu: z.boolean().nullish(),
  menuGroup: z.string().nullish(),
  menuLabel: z.string().nullish(),
  menuOrder: z.number().nullish(),
  heroTitle: z.string().nullish(),
  heroDescription: z.string().nullish(),
});

/** 노출 위치. LANDING 은 /category/{키} 랜딩, PROGRAM_FILTER 는 전체 프로그램 필터 한 줄 */
export const placementTypeLabel = {
  LANDING: '카테고리 랜딩 페이지',
  PROGRAM_FILTER: '전체 프로그램 필터',
} as const;
export type ProgramCategoryPlacementType = keyof typeof placementTypeLabel;
export type ProgramCategoryMatchMode = 'ANY' | 'ALL';

const placementSchema = z.object({
  id: z.number().nullish(),
  placementType: z.enum(['LANDING', 'PROGRAM_FILTER']),
  slug: z.string().nullish(),
  mergeChallenges: z.boolean().nullish(),
  matchMode: z.enum(['ANY', 'ALL', 'GROUP']).nullish(),
  // 랜딩에만 있다. GNB 메뉴와 랜딩 상단 문구 (서버 LC-3626 부터)
  menuGroup: z.string().nullish(),
  /** 저장값이 없으면 서버가 노출 목록 이름을 준다 */
  menuLabel: z.string().nullish(),
  menuOrder: z.number().nullish(),
  showInMenu: z.boolean().nullish(),
  heroTitle: z.string().nullish(),
  heroDescription: z.string().nullish(),
});
export type ProgramCategoryPlacement = z.infer<typeof placementSchema>;

const programCategoryGroupSchema = programCategorySchema.extend({
  slug: z.string().nullish(),
  purpose: z.enum(['FILTER', 'LANDING']).nullish(),
  placements: z.array(placementSchema).nullish(),
  categoryList: z.array(programCategoryItemSchema),
});

const programCategoryGroupListSchema = z.object({
  programCategoryGroupList: z.array(programCategoryGroupSchema),
});

export type ProgramCategory = z.infer<typeof programCategoryItemSchema>;
export type ProgramCategoryGroup = z.infer<typeof programCategoryGroupSchema>;

export const AdminProgramCategoryQueryKey = 'adminProgramCategoryGroupList';

/** GET 카테고리 목록 전체 (숨김 포함) /api/v1/admin/program-category */
export const useAdminProgramCategoryGroupsQuery = () =>
  useQuery({
    queryKey: [AdminProgramCategoryQueryKey],
    queryFn: async () => {
      const res = await axios.get('/admin/program-category');
      return programCategoryGroupListSchema.parse(res.data.data)
        .programCategoryGroupList;
    },
    refetchOnWindowFocus: false,
  });

const useInvalidatingMutation = <T, R = unknown>(
  mutationFn: (body: T) => Promise<R>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [AdminProgramCategoryQueryKey],
      }),
  });
};

/** POST 목록 추가 /api/v1/admin/program-category/group */
export const useCreateProgramCategoryGroup = () =>
  useInvalidatingMutation((body: { title: string }) =>
    axios.post('/admin/program-category/group', body),
  );

/** PATCH 목록 이름·숨김 /api/v1/admin/program-category/group/{id} */
export const useUpdateProgramCategoryGroup = () =>
  useInvalidatingMutation(
    ({ id, ...body }: { id: number; title?: string; isVisible?: boolean }) =>
      axios.patch(`/admin/program-category/group/${id}`, body),
  );

/** PUT 노출 위치 통째로 /api/v1/admin/program-category/group/{id}/placements */
export const useUpdateProgramCategoryPlacements = () =>
  useInvalidatingMutation(
    ({
      id,
      placementList,
    }: {
      id: number;
      placementList: {
        placementType: ProgramCategoryPlacementType;
        slug?: string;
        mergeChallenges: boolean;
        matchMode?: ProgramCategoryMatchMode;
        menuGroup?: string;
        menuLabel?: string;
        menuOrder?: number;
        showInMenu?: boolean;
        heroTitle?: string;
        heroDescription?: string;
      }[];
    }) =>
      axios.put(`/admin/program-category/group/${id}/placements`, {
        placementList,
      }),
  );

/** DELETE 목록 삭제 (안의 카테고리·연결 포함) /api/v1/admin/program-category/group/{id} */
export const useDeleteProgramCategoryGroup = () =>
  useInvalidatingMutation((id: number) =>
    axios.delete(`/admin/program-category/group/${id}`),
  );

/** DELETE 카테고리 삭제 (연결 포함) /api/v1/admin/program-category/{id} */
export const useDeleteProgramCategory = () =>
  useInvalidatingMutation((id: number) =>
    axios.delete(`/admin/program-category/${id}`),
  );

/** PUT 목록 순서 /api/v1/admin/program-category/group/order */
export const useReorderProgramCategoryGroups = () =>
  useInvalidatingMutation((programCategoryGroupIdList: number[]) =>
    axios.put('/admin/program-category/group/order', {
      programCategoryGroupIdList,
    }),
  );

/** POST 카테고리 추가 /api/v1/admin/program-category */
export const useCreateProgramCategory = () =>
  useInvalidatingMutation(
    (body: { programCategoryGroupId: number; title: string }) =>
      axios.post('/admin/program-category', body),
  );

/** PATCH 카테고리 이름·숨김 /api/v1/admin/program-category/{id} */
export const useUpdateProgramCategory = () =>
  useInvalidatingMutation(
    ({
      id,
      ...body
    }: {
      id: number;
      title?: string;
      isVisible?: boolean;
      /** 빈 문자열이면 지운다 */
      slug?: string;
      displayType?: ProgramCategoryDisplayType;
      /** 빈 문자열이면 지운다 */
      description?: string;
      /** 빈 배열이면 해제 */
      sourceCategoryIdList?: number[];
    }) => axios.patch(`/admin/program-category/${id}`, body),
  );

/** PUT 카테고리 바로 갈 상품 (둘 다 null 이면 해제) /api/v1/admin/program-category/{id}/direct-target */
export const useUpdateProgramCategoryDirectTarget = () =>
  useInvalidatingMutation(
    ({
      id,
      ...body
    }: {
      id: number;
      targetType: ProgramCategoryTargetType | null;
      targetId: number | null;
    }) => axios.put(`/admin/program-category/${id}/direct-target`, body),
  );

/** PUT 목록 안 카테고리 순서 /api/v1/admin/program-category/order */
export const useReorderProgramCategories = () =>
  useInvalidatingMutation(
    (body: {
      programCategoryGroupId: number;
      programCategoryIdList: number[];
    }) => axios.put('/admin/program-category/order', body),
  );

const programCategoryIdsSchema = z.object({
  programCategoryIdList: z.array(z.number()),
});

const programCategoryIdsQueryKey = 'adminProgramCategoryIdsOfProgram';

/** GET 프로그램에 지정된 카테고리 id /api/v1/admin/program-category/program */
export const useProgramCategoryIdsQuery = (
  programType: ProgramCategoryTargetType,
  programId: number,
) =>
  useQuery({
    queryKey: [programCategoryIdsQueryKey, programType, programId],
    queryFn: async () => {
      const res = await axios.get('/admin/program-category/program', {
        params: { programType, programId },
      });
      return programCategoryIdsSchema.parse(res.data.data)
        .programCategoryIdList;
    },
    enabled: programId > 0,
    refetchOnWindowFocus: false,
  });

/** PUT 대상의 카테고리 지정 (전체 교체). 생성 직후 새 id 로 저장할 때 쓴다 */
export const putProgramCategoriesOfTarget = (
  programType: ProgramCategoryTargetType,
  programId: number,
  programCategoryIdList: number[],
) =>
  axios.put('/admin/program-category/program', {
    programType,
    programId,
    programCategoryIdList,
  });

/** PUT 대상의 카테고리 지정 (전체 교체) /api/v1/admin/program-category/program */
export const usePutProgramCategoriesOfTarget = (
  programType: ProgramCategoryTargetType,
  programId: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (programCategoryIdList: number[]) =>
      axios.put('/admin/program-category/program', {
        programType,
        programId,
        programCategoryIdList,
      }),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [programCategoryIdsQueryKey, programType, programId],
      });
      queryClient.invalidateQueries({
        queryKey: [AdminProgramCategoryQueryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [programCategoryTargetsQueryKey],
      });
    },
  });
};

const programCategoryTargetSchema = z.object({
  mappingId: z.number(),
  targetType: targetTypeSchema,
  targetId: z.number(),
  title: z.string().nullable(),
  thumbnail: z.string().nullish(),
});

export type ProgramCategoryTarget = z.infer<typeof programCategoryTargetSchema>;

const programCategoryTargetsQueryKey = 'adminProgramCategoryTargets';

/** GET 카테고리에 연결된 대상 /api/v1/admin/program-category/{id}/targets */
export const useProgramCategoryTargetsQuery = (
  programCategoryId: number,
  enabled: boolean,
) =>
  useQuery({
    queryKey: [programCategoryTargetsQueryKey, programCategoryId],
    queryFn: async () => {
      const res = await axios.get(
        `/admin/program-category/${programCategoryId}/targets`,
      );
      return z
        .object({ targetList: z.array(programCategoryTargetSchema) })
        .parse(res.data.data).targetList;
    },
    enabled,
    refetchOnWindowFocus: false,
  });

/** DELETE 연결 하나 해제 /api/v1/admin/program-category/mapping/{mappingId} */
export const useDeleteProgramCategoryMapping = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mappingId: number) =>
      axios.delete(`/admin/program-category/mapping/${mappingId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [programCategoryTargetsQueryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [AdminProgramCategoryQueryKey],
      });
      queryClient.invalidateQueries({ queryKey: [programCategoryIdsQueryKey] });
    },
  });
};

// ---------------------------------------------------------------------------
// 프로그램 분류(태그) = 랜딩 페이지 (서버 LC-3626)
// ---------------------------------------------------------------------------

/** POST 분류 추가. 필터 줄에 넣고 기본 섹션 5개를 만든다 /api/v1/admin/program-category/tag */
export const useCreateProgramCategoryTag = () =>
  useInvalidatingMutation(
    async (body: {
      programCategoryGroupId: number;
      title: string;
      slug?: string;
    }) => {
      const res = await axios.post('/admin/program-category/tag', body);
      return z.object({ programCategoryId: z.number() }).parse(res.data.data)
        .programCategoryId;
    },
  );

export interface ProgramCategoryPageInput {
  showInMenu: boolean;
  menuGroup: string;
  menuLabel: string;
  menuOrder?: number;
  heroTitle: string;
  heroDescription: string;
}

/** PATCH 분류 랜딩의 메뉴·상단 문구 (통째로) /api/v1/admin/program-category/{id}/page */
export const useUpdateProgramCategoryPage = () =>
  useInvalidatingMutation(
    ({ id, ...body }: { id: number } & ProgramCategoryPageInput) =>
      axios.patch(`/admin/program-category/${id}/page`, body),
  );

/** PATCH 분류를 다른 필터 줄로 옮기기 /api/v1/admin/program-category/{id}/group */
export const useMoveProgramCategory = () =>
  useInvalidatingMutation(
    ({
      id,
      programCategoryGroupId,
    }: {
      id: number;
      programCategoryGroupId: number;
    }) =>
      axios.patch(`/admin/program-category/${id}/group`, {
        programCategoryGroupId,
      }),
  );

export const sectionTargetTypes = [
  'CHALLENGE',
  'LIVE',
  'VOD',
  'GUIDEBOOK',
  'MAGNET',
  'LIVE_MENTORING',
  'MEMBERSHIP',
  'BLOG',
] as const satisfies readonly ProgramCategoryTargetType[];

const sectionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullish(),
  displayType: z
    .enum(['AUTO', 'FEATURED', 'CARDS', 'MENTOR', 'BLOG'])
    .nullish(),
  matchMode: z.enum(['ANY', 'ALL', 'GROUP']).nullish(),
  tagIds: z.array(z.number()),
  targetTypes: z.array(targetTypeSchema),
  pinnedTargetType: targetTypeSchema.nullish(),
  pinnedTargetId: z.number().nullish(),
  sortOrder: z.number(),
  isVisible: z.boolean(),
});
export type ProgramCategorySection = z.infer<typeof sectionSchema>;

export interface ProgramCategorySectionInput {
  title: string;
  description: string;
  displayType: ProgramCategoryDisplayType;
  matchMode: ProgramCategoryMatchMode;
  tagIds: number[];
  targetTypes: ProgramCategoryTargetType[];
  pinnedTargetType: ProgramCategoryTargetType | null;
  pinnedTargetId: number | null;
  isVisible: boolean;
}

const sectionsQueryKey = 'adminProgramCategorySections';

/** GET 분류 랜딩 섹션 /api/v1/admin/program-category/{id}/sections */
export const useProgramCategorySectionsQuery = (programCategoryId: number) =>
  useQuery({
    queryKey: [sectionsQueryKey, programCategoryId],
    queryFn: async () => {
      const res = await axios.get(
        `/admin/program-category/${programCategoryId}/sections`,
      );
      return z
        .object({ sectionList: z.array(sectionSchema) })
        .parse(res.data.data).sectionList;
    },
    refetchOnWindowFocus: false,
  });

const useSectionsMutation = <T>(mutationFn: (body: T) => Promise<unknown>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [sectionsQueryKey] });
      queryClient.invalidateQueries({ queryKey: [landingQueryKey] });
    },
  });
};

/** PUT 섹션 통째로 (순서 = 목록 순서) /api/v1/admin/program-category/{id}/sections */
export const useReplaceProgramCategorySections = () =>
  useSectionsMutation(
    ({
      id,
      sectionList,
    }: {
      id: number;
      sectionList: ProgramCategorySectionInput[];
    }) => axios.put(`/admin/program-category/${id}/sections`, { sectionList }),
  );

/** POST 섹션이 없을 때 기본 섹션 5개 /api/v1/admin/program-category/{id}/sections/default */
export const useCreateDefaultSections = () =>
  useSectionsMutation((id: number) =>
    axios.post(`/admin/program-category/${id}/sections/default`),
  );

export const landingTargetSchema = z.object({
  targetType: targetTypeSchema,
  targetId: z.number(),
  title: z.string(),
  thumbnail: z.string().nullish(),
  shortDesc: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  deadline: z.string().nullish(),
  challengeType: z.string().nullish(),
  price: z.number().nullish(),
  durations: z.array(z.number()).nullish(),
  mentorCompany: z.string().nullish(),
  mentorJob: z.string().nullish(),
  categoryIds: z.array(z.number()),
  mergedTargetIds: z.array(z.number()).nullish(),
});
export type LandingTarget = z.infer<typeof landingTargetSchema>;

const landingSchema = z.object({
  page: z.object({
    id: z.number(),
    title: z.string(),
    slug: z.string().nullish(),
    heroTitle: z.string().nullish(),
    heroDescription: z.string().nullish(),
  }),
  sectionList: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string().nullish(),
      displayType: z
        .enum(['AUTO', 'FEATURED', 'CARDS', 'MENTOR', 'BLOG'])
        .nullish(),
      targetList: z.array(landingTargetSchema),
    }),
  ),
});
export type ProgramCategoryLanding = z.infer<typeof landingSchema>;

const landingQueryKey = 'adminProgramCategoryLanding';

/** 공개 분류 랜딩 조회 옵션. 섹션이 없으면 서버가 404 를 주므로 null 로 둔다 */
export const landingQueryOptions = (slug: string | null | undefined) => ({
  queryKey: [landingQueryKey, slug],
  queryFn: async (): Promise<ProgramCategoryLanding | null> => {
    try {
      const res = await axios.get(`/program-category/landing/${slug}`);
      return landingSchema.parse(res.data.data);
    } catch {
      return null;
    }
  },
  enabled: Boolean(slug),
  refetchOnWindowFocus: false,
});

/** GET 공개 분류 랜딩 /api/v1/program-category/landing/{slug}. 사이트와 같은 결과다 */
export const useProgramCategoryLandingQuery = (
  slug: string | null | undefined,
) => useQuery(landingQueryOptions(slug));

/** 주소가 있는 모든 분류의 랜딩. 점검·상품별 노출 위치가 쓴다 */
export const useAllLandingsQuery = (slugs: string[]) =>
  useQueries({
    queries: slugs.map((slug) => landingQueryOptions(slug)),
    combine: (results) => ({
      bySlug: new Map(slugs.map((slug, i) => [slug, results[i]?.data ?? null])),
      isLoading: results.some((r) => r.isLoading),
    }),
  });

const migrationSchema = z.object({
  dryRun: z.boolean(),
  pageList: z.array(
    z.object({
      slug: z.string(),
      landingGroupTitle: z.string().nullish(),
      tagId: z.number().nullish(),
      tagTitle: z.string().nullish(),
      status: z.enum(['MIGRATED', 'SKIPPED_NO_TAG', 'SKIPPED_HAS_SECTIONS']),
      sectionList: z.array(
        z.object({
          title: z.string(),
          tagIds: z.array(z.number()),
          targetTypes: z.array(targetTypeSchema),
          visible: z.boolean(),
          note: z.string().nullish(),
        }),
      ),
      addedMappingCount: z.number(),
      newlyInFilterList: z.array(z.string()),
    }),
  ),
  duplicateTagTitleList: z.array(z.string()),
});
export type LandingMigrationReport = z.infer<typeof migrationSchema>;

/** POST 일회성: 예전 랜딩을 분류 섹션으로 옮기기 (dryRun 이면 보고서만) */
export const useMigrateLandings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dryRun: boolean) => {
      const res = await axios.post(
        '/admin/program-category/migration/landing',
        null,
        {
          params: { dryRun },
        },
      );
      return migrationSchema.parse(res.data.data);
    },
    onSuccess: (_, dryRun) => {
      if (dryRun) return;
      queryClient.invalidateQueries({
        queryKey: [AdminProgramCategoryQueryKey],
      });
      queryClient.invalidateQueries({ queryKey: [sectionsQueryKey] });
      queryClient.invalidateQueries({ queryKey: [landingQueryKey] });
    },
  });
};
