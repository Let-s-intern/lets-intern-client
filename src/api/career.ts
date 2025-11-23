import { Pageable, Sortable, userCareerListSchema } from '@/api/careerSchema';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const UserCareerQueryKey = 'userCareerQueryKey';

export const useGetUserCareerQuery = (
  pageable: Pageable,
  sortable?: Sortable,
) => {
  return useQuery({
    queryKey: [
      UserCareerQueryKey,
      ...Object.values(pageable),
      ...(sortable ? Object.values(sortable) : []),
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(pageable.page),
        size: String(pageable.size),
      });

      if (sortable) {
        params.append('sort', String(sortable.sort));
        params.append('sortType', String(sortable.sortType));
      }

      const res = await axios.get(`/user-career/my?${params.toString()}`);
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
