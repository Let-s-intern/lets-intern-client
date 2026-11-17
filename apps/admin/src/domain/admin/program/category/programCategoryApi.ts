import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

export type ProgramCategoryProgramType = 'CHALLENGE' | 'LIVE' | 'VOD';

const programCategorySchema = z.object({
  id: z.number(),
  title: z.string(),
  sortOrder: z.number(),
  isVisible: z.boolean(),
});

const programCategoryGroupSchema = programCategorySchema.extend({
  categoryList: z.array(programCategorySchema),
});

const programCategoryGroupListSchema = z.object({
  programCategoryGroupList: z.array(programCategoryGroupSchema),
});

export type ProgramCategory = z.infer<typeof programCategorySchema>;
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
    ({ id, ...body }: { id: number; title?: string; isVisible?: boolean }) =>
      axios.patch(`/admin/program-category/group/${id}`, body),
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
    ({ id, ...body }: { id: number; title?: string; isVisible?: boolean }) =>
      axios.patch(`/admin/program-category/${id}`, body),
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
  programType: ProgramCategoryProgramType,
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

/** PUT 프로그램 카테고리 지정 (전체 교체) /api/v1/admin/program-category/program */
export const putProgramCategoriesOfProgram = (body: {
  programType: ProgramCategoryProgramType;
  programId: number;
  programCategoryIdList: number[];
}) => axios.put('/admin/program-category/program', body);
