import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

const programCategoryItemSchema = programCategorySchema.extend({
  programCount: z.number(),
  // 이전 서버 응답에는 없어서 nullish
  slug: z.string().nullish(),
  directTargetType: targetTypeSchema.nullish(),
  directTargetId: z.number().nullish(),
});

/** 노출 목록 용도. FILTER 는 필터·메뉴, LANDING 은 카테고리 랜딩 한 페이지 */
export type ProgramCategoryGroupPurpose = 'FILTER' | 'LANDING';

const programCategoryGroupSchema = programCategorySchema.extend({
  slug: z.string().nullish(),
  purpose: z.enum(['FILTER', 'LANDING']).nullish(),
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

const useInvalidatingMutation = <T>(
  mutationFn: (body: T) => Promise<unknown>,
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
    ({
      id,
      ...body
    }: {
      id: number;
      title?: string;
      isVisible?: boolean;
      /** 빈 문자열이면 지운다 */
      slug?: string;
      purpose?: ProgramCategoryGroupPurpose;
    }) => axios.patch(`/admin/program-category/group/${id}`, body),
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
