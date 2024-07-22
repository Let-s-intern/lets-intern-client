import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { IPageable } from '../types/interface';
import axios from '../utils/axios';
import { blogSchema, blogTagSchema, TagDetail } from './blogSchema';

const blogQueryKey = 'BlogQueryKey';
const blogTagQueryKey = 'BlogTagQueryKey';

export const useBlogQuery = (
  pageable: IPageable,
  type?: string,
  tagId?: number,
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
      alert('태그를 추가하지 못했습니다.');
      onErrorCallback && onErrorCallback();
    },
  });
};
