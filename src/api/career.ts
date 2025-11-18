import { Pageable, userCareerListSchema } from '@/api/careerSchema';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const UserCareerQueryKey = 'userCareerQueryKey';

export const useGetUserCareerQuery = (pageable: Pageable) => {
  return useQuery({
    queryKey: [UserCareerQueryKey, ...Object.values(pageable)],
    queryFn: async () => {
      const res = await axios.get(
        `/user-career/my?page=${pageable.page}&size=${pageable.size}`,
      );
      return userCareerListSchema.parse(res.data.data);
    },
  });
};

export const usePostUserCareerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (careerData: FormData) => {
      await axios.post('/user-career/my', careerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserCareerQueryKey] });
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

export const usePatchUserCareerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { careerId: number; careerData: FormData }) => {
      const { careerId, careerData: formData } = data;
      await axios.patch(`/user-career/my/${careerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserCareerQueryKey] });
    },
  });
};
