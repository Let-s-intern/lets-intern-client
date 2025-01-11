import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { IPageable } from '../types/interface';
import axios from '../utils/axios';
import {
  blogListSchema,
  blogRatingListSchema,
  blogSchema,
  blogTagSchema,
  PatchBlogReqBody,
  PostBlogReqBody,
  TagDetail,
} from './blogSchema';

const blogListQueryKey = 'BlogListQueryKey';
const blogQueryKey = 'BlogQueryKey';
const blogTagQueryKey = 'BlogTagQueryKey';
const blogRatingQueryKey = 'blogRatingQueryKey';

export interface BlogQueryParams {
  pageable: IPageable;
  type?: string | null;
  tagId?: number | null;
}

export const useBlogListQuery = ({ pageable, type }: BlogQueryParams) => {
  return useQuery({
    queryKey: [blogListQueryKey, pageable, type],
    queryFn: async () => {
      const res = await axios.get(`/blog`, { params: { ...pageable, type } });
      return blogListSchema.parse(res.data.data);
    },
  });
};

export const useBlogListTypeQuery = ({ pageable, type }: BlogQueryParams) => {
  return useQuery({
    queryKey: [blogListQueryKey, pageable],
    queryFn: async () => {
      const res = await axios.get(`/blog`, {
        params: {
          ...pageable,
          type,
        },
      });
      return blogListSchema.parse(res.data.data);
    },
    enabled: !!type,
  });
};

export const useInfiniteBlogListQuery = ({
  type,
  tagId,
  pageable,
}: BlogQueryParams) => {
  return useInfiniteQuery({
    queryKey: [blogListQueryKey, pageable, type, tagId],
    queryFn: async ({ pageParam = pageable }) => {
      const res = await axios.get('/blog', {
        params: {
          ...pageParam,
          type,
          tagId,
        },
      });
      return blogListSchema.parse(res.data.data);
    },
    initialPageParam: pageable,
    getNextPageParam: (lastPage) => {
      return lastPage.pageInfo.totalElements === 0 ||
        lastPage.pageInfo.totalPages - 1 === lastPage.pageInfo.pageNum
        ? undefined
        : { page: lastPage.pageInfo.pageNum + 2, size: pageable.size };
    },
  });
};

export const useBlogQuery = (blogId: string) => {
  return useQuery({
    queryKey: [blogQueryKey, blogId],
    queryFn: async () => {
      const res = await axios.get(`/blog/${blogId}`);
      return blogSchema.parse(res.data.data);
    },
  });
};

export const usePostBlogMutation = (onErrorCallback?: () => void) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (newBlog: PostBlogReqBody) => {
      return await axios.post('/blog', newBlog);
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: [blogListQueryKey] });
    },
    onError: (error) => {
      console.error(error);
      onErrorCallback && onErrorCallback();
    },
  });
};

export const useDeleteBlogMutation = (onErrorCallback?: () => void) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (blogId: number) => {
      return await axios.delete(`/blog/${blogId}`);
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: [blogListQueryKey] });
    },
    onError: (error) => {
      console.error(error);
      onErrorCallback && onErrorCallback();
    },
  });
};

// PATCH: request body에 isDisplayed 속성을 필수로 넣어야 함
export const usePatchBlogMutation = (onErrorCallback?: () => void) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (blog: PatchBlogReqBody) => {
      const reqBody: any = { ...blog };
      delete reqBody.id;
      const res = await axios.patch(`/blog/${blog.id}`, reqBody);
      return res;
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: [blogListQueryKey] });
      await client.invalidateQueries({ queryKey: [blogQueryKey] });
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
      return blogTagSchema.parse(res.data.data).tagDetailInfos;
    },
  });
};

export const usePostBlogTagMutation = (onErrorCallback?: () => void) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (title: TagDetail['title']) => {
      return await axios.post('/blog-tag', { title });
    },
    onSuccess: async (data) => {
      await client.invalidateQueries({ queryKey: [blogTagQueryKey] });
      return data;
    },
    onError: (error) => {
      console.error(error);
      onErrorCallback && onErrorCallback();
    },
  });
};

export const useDeleteBlogTagMutation = ({
  onError,
}: {
  onError?: (error: Error) => void;
}) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (blogId: number) => {
      try {
        return await axios.delete(`/blog-tag/${blogId}`);
      } catch (error) {
        onError && onError(error as Error);
      }
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: [blogTagQueryKey] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

/* 블로그 후기 */
export const useBlogRatingListQuery = (pageable: IPageable) => {
  return useQuery({
    queryKey: [blogRatingQueryKey, pageable],
    queryFn: async () => {
      const res = await axios.get('/blog-rating', { params: pageable });
      return blogRatingListSchema.parse(res.data.data);
    },
  });
};

export const usePostBlogRatingMutation = ({
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: () => void;
}) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({
      blogId,
      title,
      score,
    }: {
      blogId: string;
      title: string;
      score: number;
    }) => {
      return await axios.post(`/blog-rating/${blogId}`, { title, score });
    },
    onSuccess: async () => {
      client.invalidateQueries({ queryKey: [blogRatingQueryKey] });
      successCallback && successCallback();
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
