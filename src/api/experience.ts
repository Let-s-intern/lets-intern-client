import axios from '@/utils/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  userExperienceListSchema,
  userExperienceSchema,
  UserExperienceType
} from './experienceSchema';

export const UseUserExperienceQueryKey = 'useUserExperienceQueryKey';

export const useGetAllUserExperienceQuery = ({page, size, sort}: {page: number; size: number; sort: string[]}) => {
  return useQuery({
    queryKey: [UseUserExperienceQueryKey, page, size, sort],
    queryFn: async () => {
      const res = await axios.get(`/user-experience`, { params: { page, size, sort } });
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