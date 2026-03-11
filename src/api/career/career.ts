import {
  Pageable,
  Sortable,
  userCareerListSchema,
  userCareerSchema,
} from '@/api/career/careerSchema';
import { UserExperience } from '@/api/user/userSchema';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

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

export const AdminUserCareerQueryKey = 'adminUserCareerQueryKey';

export const useGetAdminUserCareerQuery = (
  userId: number,
  pageable: Pageable,
) => {
  return useQuery({
    queryKey: [AdminUserCareerQueryKey, userId, ...Object.values(pageable)],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(pageable.page),
        size: String(pageable.size),
      });
      const res = await axios.get(
        `/admin/user-career/user/${userId}?${params.toString()}`,
      );
      const data = res.data.data;

      // admin API 응답 구조가 다를 수 있으므로 유연하게 파싱
      const listResult = userCareerListSchema.safeParse(data);
      if (listResult.success) {
        return listResult.data;
      }

      // 배열로 직접 반환하는 경우
      const arrayResult = z.array(userCareerSchema).safeParse(data);
      if (arrayResult.success) {
        return {
          userCareers: arrayResult.data,
          pageInfo: {
            pageNum: 0,
            pageSize: arrayResult.data.length,
            totalElements: arrayResult.data.length,
            totalPages: 1,
          },
        };
      }

      // 다른 키 이름을 사용하는 경우 (content, careers 등)
      if (data && typeof data === 'object') {
        const possibleArrays = Object.values(data).find(Array.isArray);
        if (possibleArrays) {
          const careers = z.array(userCareerSchema).safeParse(possibleArrays);
          if (careers.success) {
            return {
              userCareers: careers.data,
              pageInfo: data.pageInfo ?? {
                pageNum: 0,
                pageSize: careers.data.length,
                totalElements: careers.data.length,
                totalPages: 1,
              },
            };
          }
        }
      }

      return { userCareers: [], pageInfo: { pageNum: 0, pageSize: 0, totalElements: 0, totalPages: 0 } };
    },
    enabled: !!userId,
  });
};

export const usePostAdminCareerMutation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (careerData: FormData) => {
      await axios.post(`/admin/user-career/user/${userId}`, careerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserCareerQueryKey] });
      queryClient.invalidateQueries({
        queryKey: [AdminUserCareerQueryKey, userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['useUserDetailQueryKey', userId],
      });
    },
  });
};

export const usePostAdminExperienceMutation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserExperience) => {
      const res = await axios.post(
        `/admin/user-experience/user/${userId}`,
        data,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useUserDetailQueryKey', userId],
      });
    },
  });
};
