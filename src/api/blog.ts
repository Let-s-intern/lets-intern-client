import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { IPageable } from '../types/interface';
import axios from '../utils/axios';
import { blogSchema, blogTagSchema, PostBlog, TagDetail } from './blogSchema';

const blogQueryKey = 'BlogQueryKey';
const blogTagQueryKey = 'BlogTagQueryKey';

interface BlogQueryParams {
  pageable: IPageable;
  type?: string;
  tagId?: number;
}

export const useBlogQuery = ({ type, tagId, pageable }: BlogQueryParams) => {
  return useQuery({
    queryKey: [blogQueryKey, pageable],
    queryFn: async () => {
      const res = await axios.get(`/blog`, { params: pageable });
      console.log(res);
      return blogSchema.parse(res.data.data);
    },
  });
};

export const usePostBlogMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: () => void,
) => {
  return useMutation({
    mutationFn: async (newBlog: PostBlog) => {
      return await axios.post('/blog', newBlog);
    },
    onSuccess: () => {
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      console.error(error);
      onErrorCallback && onErrorCallback();
    },
  });
};

export const useDeleteBlogMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: () => void,
) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (blogId: number) => {
      return await axios.delete(`/blog/${blogId}`);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [blogQueryKey] });
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      console.error(error);
      onErrorCallback && onErrorCallback();
    },
  });
};

/* 해시태그 */
export const useBlogTagQuery = () => {
  return useQuery({
    queryKey: [blogTagQueryKey],
    queryFn: async () => {
      const res = await axios.get(`/blog-tag`);
      return blogTagSchema.parse(res.data.data);
    },
  });
};

export const usePostBlogTagMutation = (
  title: TagDetail['title'],
  onSuccessCallback?: () => void,
  onErrorCallback?: () => void,
) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await axios.post('/blog-tag', { title });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [blogTagQueryKey] });
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      console.error(error);
      onErrorCallback && onErrorCallback();
    },
  });
};
