import { Pageable, userCareerListSchema } from '@/api/careerSchema';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const UserCareerQueryKey = 'userCareerQueryKey';

export const useGetUserCareerQuery = (pageable: Pageable) => {
  return useQuery({
    queryKey: [UserCareerQueryKey],
    queryFn: async () => {
      const res = await axios.get(
        `/user-career/my?page=${pageable.page}&size=${pageable.size}`,
      );
      return userCareerListSchema.parse(res.data.data);
    },
  });
};

export const usePostUserCareerMutation = () => {
  return useMutation({
    mutationFn: async (careerData: FormData) => {
      await axios.post('/user-career/my', careerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });
};

export const useDeleteUserCareerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (careerId: number) => {
      await axios.delete(`/user-career/my/${careerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserCareerQueryKey] });
    },
  });
};
