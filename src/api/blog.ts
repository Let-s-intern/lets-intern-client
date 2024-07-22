import { useQuery } from '@tanstack/react-query';

import { blogSchema, blogTagSchema } from '../schema';
import { IPageable } from '../types/interface';
import axios from '../utils/axios';

interface IBlogQuery {
  type?: string;
  tagId?: number;
  pageable: IPageable;
}

const useBlogQueryKey = 'useBlogQueryKey';
const useBlogTagQueryKey = 'useBlogTagQueryKey';

export const useBlogQuery = ({ type, tagId, pageable }: IBlogQuery) => {
  return useQuery({
    queryKey: [useBlogQueryKey, pageable],
    queryFn: async () => {
      const res = await axios.get(`/blog`, { params: pageable });
      return blogSchema.parse(res.data.data);
    },
  });
};

export const useBlogTagQuery = () => {
  return useQuery({
    queryKey: [useBlogTagQueryKey],
    queryFn: async () => {
      const res = await axios.get(`/blog-tag`);
      return blogTagSchema.parse(res.data.data);
    },
  });
};
