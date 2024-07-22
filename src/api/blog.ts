import { useMutation, useQuery } from '@tanstack/react-query';

import { IPageable } from '../types/interface';
import axios from '../utils/axios';
import { blogSchema, blogTagSchema } from './blogSchema';

const blogQueryKey = 'BlogQueryKey';
const blogTagQueryKey = 'BlogTagQueryKey';

export const useBlogQuery = (
  type: string,
  tagId: number,
  pageable: IPageable,
) => {
  return useQuery({
    queryKey: [blogQueryKey, pageable],
    queryFn: async () => {
      const res = await axios.get(`/blog`, { params: pageable });
      return blogSchema.parse(res.data.data);
    },
  });
};

export const usePostBlogMutation = (
  successCallback: () => void,
  errorCallback: () => void,
) => {
  return useMutation({
    mutationFn: async () => {
      return await axios.post('/blog');
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

// 해시태그
export const useBlogTagQuery = () => {
  return useQuery({
    queryKey: [blogTagQueryKey],
    queryFn: async () => {
      const res = await axios.get(`/blog-tag`);
      return blogTagSchema.parse(res.data.data);
    },
  });
};
