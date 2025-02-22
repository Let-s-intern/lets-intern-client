import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { IPageable } from '../types/interface';
import axios from '../utils/axios';
import {
  adminBlogBannerListSchema,
  adminBlogBannerSchema,
  blogBannerListSchema,
  BlogList,
  blogListSchema,
  blogRatingListSchema,
  BlogSchema,
  blogSchema,
  blogTagSchema,
  PatchAdminBlogBannerReqBody,
  PatchBlogReqBody,
  PostAdminBlogBannerReqBody,
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

export const useBlogListQuery = ({
  pageable,
  type,
  tagId,
}: BlogQueryParams) => {
  return useQuery({
    queryKey: [blogListQueryKey, pageable, type],
    queryFn: async () => {
      const res = await axios.get(`/blog`, {
        params: { ...pageable, type, tagId },
      });
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
      if (onErrorCallback) {
        onErrorCallback();
      }
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
      if (onErrorCallback) {
        onErrorCallback();
      }
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
      if (onErrorCallback) {
        onErrorCallback();
      }
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
      if (onErrorCallback) {
        onErrorCallback();
      }
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
        if (onError) {
          onError(error as Error);
        }
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
      if (successCallback) {
        successCallback();
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const fetchBlogData = async (id: string): Promise<BlogSchema> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/blog/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch blog data');
  }

  const data = await res.json();
  return blogSchema.parse(data.data);
};

// Fetching 추천 블로그 데이터
export const fetchRecommendBlogData = async ({
  pageable,
  type,
}: BlogQueryParams): Promise<BlogList> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/blog?type=${type}&page=${pageable.page}&size=${pageable.size}`,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch recommend blog data');
  }

  const data = await res.json();

  return blogListSchema.parse(data.data);
};

/* 블로그 광고 배너 */
const useGetAdminBlogBannerListKey = 'useGetAdminBlogBannerList';
const useGetAdminBlogBannerKey = 'useGetAdminBlogBanner';

export const useGetAdminBlogBannerList = () => {
  return useQuery({
    queryKey: [useGetAdminBlogBannerListKey],
    queryFn: async () => {
      const res = await axios.get('/admin/blog-banner');
      return adminBlogBannerListSchema.parse(res.data.data);
    },
  });
};

export const usePatchAdminBlogBanner = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (reqBody: PatchAdminBlogBannerReqBody) => {
      const body: any = { ...reqBody };
      delete body.blogBannerId;

      const res = await axios.patch(
        `/admin/blog-banner/${reqBody.blogBannerId}`,
        body,
      );
      console.log('req body:', reqBody);
      return res;
    },
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: [useGetAdminBlogBannerListKey],
      });
      await client.invalidateQueries({
        queryKey: [useGetAdminBlogBannerKey],
      });
    },
    onError: (e) => {
      if (isAxiosError(e)) {
        console.error(e.response?.data.message);
      }
    },
  });
};

export const usePostAdminBlogBanner = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (reqBody: PostAdminBlogBannerReqBody) => {
      const res = await axios.post('/admin/blog-banner', reqBody);
      console.log('req body:', reqBody);
      return res;
    },
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: [useGetAdminBlogBannerListKey],
      });
    },
    onError: (e) => {
      if (isAxiosError(e)) {
        console.error(e.response?.data.message);
      }
    },
  });
};

export const useGetAdminBlogBanner = (id: number) => {
  return useQuery({
    queryKey: [useGetAdminBlogBannerKey, id],
    queryFn: async () => {
      const res = await axios.get(`/admin/blog-banner/${id}`);
      return adminBlogBannerSchema.parse(res.data.data);
    },
  });
};

export const useGetBlogBannerList = (pageable: IPageable) => {
  return useQuery({
    queryKey: ['useGetBlogBannerList', pageable.page],
    queryFn: async () => {
      const res = await axios.get('/blog-banner', { params: pageable });
      return blogBannerListSchema.parse(res.data.data);
    },
  });
};
