import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ExperienceFiltersReq,
  Pageable,
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

export const useGetAllUserExperienceQuery = (
  filter: ExperienceFiltersReq,
  pageable: Pageable,
) => {
  const params = new URLSearchParams({
    page: pageable.page.toString(),
    size: pageable.size.toString(),
    filter: JSON.stringify(filter),
  });

  return useQuery({
    queryKey: [UserExperienceQueryKey, filter, pageable],
    queryFn: async () => {
      const res = await axios.get(`/user-experience/search`, { params });
      return userExperienceListSchema.parse(res.data.data);
    },
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
      await axios.delete(`/user-experience/${experienceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserExperienceQueryKey] });
    },
  });
};
