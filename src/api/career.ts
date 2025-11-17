import axios from '@/utils/axios';
import { useMutation, useQuery } from '@tanstack/react-query';

export const UserCareerQueryKey = 'userCareerQueryKey';

export const useGetUserCareerQuery = (pageable: Pageable) => {
  return useQuery({
    queryKey: [UserCareerQueryKey],
    queryFn: async () => {
      const res = await axios.get(
        `/user-career/my?page=${pageable.page}&size=${pageable.size}`,
      );
      return res.data.data;
    },
  });
};

export const usePostUserCareerMutation = () => {
  return useMutation({
    mutationFn: async (careerData: FormData) => {
      const { data } = await axios.post('/user-career/my', careerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.data;
    },
  });
};

export interface Pageable {
  page: number;
  size: number;
}
