import { IPageable } from '@/types/interface';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import {
  adminBlogPopupListSchema,
  adminBlogPopupSchema,
  PatchAdminBlogPopupReqBody,
  PostAdminBlogPopupReqBody,
} from './blogPopupSchema';

const useGetAdminBlogPopupListKey = 'useGetAdminBlogPopupList';
const useGetAdminBlogPopupKey = 'useGetAdminBlogPopup';

export const useGetAdminBlogPopupList = (pageable: IPageable) => {
  return useQuery({
    queryKey: [useGetAdminBlogPopupListKey, pageable],
    queryFn: async () => {
      const res = await axios.get('/admin/blog-popup', { params: pageable });
      return adminBlogPopupListSchema.parse(res.data.data);
    },
  });
};

export const useGetAdminBlogPopup = (id: number) => {
  return useQuery({
    queryKey: [useGetAdminBlogPopupKey, id],
    queryFn: async () => {
      const res = await axios.get(`/admin/blog-popup/${id}`);
      return adminBlogPopupSchema.parse(res.data.data);
    },
  });
};

export const usePostAdminBlogPopup = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (reqBody: PostAdminBlogPopupReqBody) => {
      const res = await axios.post('/admin/blog-popup', reqBody);
      return res;
    },
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: [useGetAdminBlogPopupListKey],
      });
    },
    onError: (e) => {
      if (isAxiosError(e)) {
        console.error(e.response?.data.message);
      }
    },
  });
};

export const usePatchAdminBlogPopup = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({
      blogPopupId,
      ...body
    }: PatchAdminBlogPopupReqBody) => {
      const res = await axios.patch(`/admin/blog-popup/${blogPopupId}`, body);
      return res;
    },
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: [useGetAdminBlogPopupListKey],
      });
      await client.invalidateQueries({
        queryKey: [useGetAdminBlogPopupKey],
      });
    },
    onError: (e) => {
      if (isAxiosError(e)) {
        console.error(e.response?.data.message);
      }
    },
  });
};

export const useDeleteAdminBlogPopup = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (blogPopupId: number) => {
      const res = await axios.delete(`/admin/blog-popup/${blogPopupId}`);
      return res;
    },
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: [useGetAdminBlogPopupListKey],
      });
    },
    onError: (e) => {
      if (isAxiosError(e)) {
        console.error(e.response?.data.message);
      }
    },
  });
};
