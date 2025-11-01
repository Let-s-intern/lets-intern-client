import axios from '@/utils/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Pageable,
  UserExperienceFilters,
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
  filter: UserExperienceFilters,
  pageable: Pageable,
) => {
  return useQuery({
    queryKey: [UserExperienceQueryKey, filter, pageable],
    queryFn: async () => {
      const res = await axios.post(
        `/user-experience/search?page=${pageable.page}&size=${pageable.size}`,
        filter,
      );
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
