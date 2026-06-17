import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ExperienceFiltersReq,
  Pageable,
  Sortable,
  userExperienceListSchema,
  userExperienceSchema,
  UserExperienceType,
} from './experienceSchema';

export const UserExperienceFiltersQueryKey = 'userExperienceFiltersQueryKey';
export const UserExperienceQueryKey = 'userExperienceQueryKey';

export const useGetUserExperienceFiltersQuery = () => {
  return useQuery({
    queryKey: [UserExperienceFiltersQueryKey],
    queryFn: async () => {
      const res = await axios.get(`/user-experience/filters`);
      return res.data.data;
    },
  });
};

export const allUserExperienceQueryOptions = (
  filter: ExperienceFiltersReq,
  sortable: Sortable,
  pageable: Pageable,
) => ({
  queryKey: [UserExperienceQueryKey, filter, sortable, pageable] as const,
  queryFn: async () => {
    const res = await axios.post(
      `/user-experience/search?page=${pageable.page}&size=${pageable.size}`,
      { ...filter, sortType: sortable },
    );
    return userExperienceListSchema.parse(res.data.data);
  },
});

export const useGetAllUserExperienceQuery = (
  filter: ExperienceFiltersReq,
  sortable: Sortable,
  pageable: Pageable,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    ...allUserExperienceQueryOptions(filter, sortable, pageable),
    enabled: options?.enabled,
  });
};

export const usePostUserExperienceMutation = () => {
  return useMutation({
    mutationFn: async (newExperience: UserExperienceType) => {
      const res = await axios.post(`/user-experience`, newExperience);
      return userExperienceSchema.parse(res.data.data);
    },
  });
};

export const useDeleteUserExperienceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (experienceId: number) => {
      await axios.delete(`/user-experience/mypage/${experienceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserExperienceQueryKey] });
    },
  });
};
