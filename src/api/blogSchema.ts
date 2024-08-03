import dayjs from 'dayjs';
import { z } from 'zod';

export interface PostBlogReqBody {
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  content: string;
  ctaLink: string;
  ctaText: string;
  displayDate: string;
  tagList: number[];
}

export interface PatchBlogReqBody {
  id: number;
  title?: string;
  category?: string;
  thumbnail?: string;
  description?: string;
  content?: string;
  ctaLink?: string;
  ctaText?: string;
  isDisplayed?: boolean;
  tagList?: number[];
}

export type TagDetail = z.infer<typeof tagDetailSchema>[0];
export type PostTag = z.infer<typeof postTagSchema>;
export type BlogThumbnail = z.infer<typeof blogThumbnailSchema>;
export type BlogRating = z.infer<typeof blogRatingSchema>['ratingInfos'][0];

export const pageSchema = z.object({
  pageNum: z.number(),
  pageSize: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

export const blogThumbnailSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  displayDate: z.string().nullable().optional(),
  isDisplayed: z.boolean().nullable().optional(),
  createDate: z.string().nullable().optional(),
  lastModifiedDate: z.string().nullable().optional(),
});

export const blogDetailSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  isDisplayed: z.boolean().nullable().optional(),
  ctaLink: z.string().nullable().optional(),
  ctaText: z.string().nullable().optional(),
  displayDate: z.string().nullable().optional(),
  createDate: z.string().nullable().optional(),
  lastModifiedDate: z.string().nullable().optional(),
});

export const tagSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  createDate: z.string().nullable().optional(),
  lastModifiedDate: z.string().nullable().optional(),
});

export type TagType = z.infer<typeof tagSchema>;

export const tagDetailSchema = z.array(tagSchema);

export const blogRawSchema = z.object({
  blogDetailInfo: blogDetailSchema,
  tagDetailInfos: tagDetailSchema,
});

export const postTagSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
});

export const blogSchema = z
  .object({
    blogDetailInfo: blogDetailSchema,
    tagDetailInfos: tagDetailSchema,
  })
  .transform((data) => {
    return {
      blogDetailInfo: {
        ...data.blogDetailInfo,
        createDate: data.blogDetailInfo.createDate
          ? dayjs(data.blogDetailInfo.createDate)
          : null,
        lastModifiedDate: data.blogDetailInfo.lastModifiedDate
          ? dayjs(data.blogDetailInfo.lastModifiedDate)
          : null,
      },
      tagDetailInfos: data.tagDetailInfos,
    };
  });

export const blogInfoSchema = z.object({
  blogThumbnailInfo: blogThumbnailSchema,
  tagDetailInfos: tagDetailSchema,
});

export const transformedBlogInfoSchema = blogInfoSchema.transform((data) => {
  return {
    blogThumbnailInfo: {
      ...data.blogThumbnailInfo,
      displayDate: data.blogThumbnailInfo.displayDate
        ? dayjs(data.blogThumbnailInfo.displayDate)
        : null,
      createDate: data.blogThumbnailInfo.createDate
        ? dayjs(data.blogThumbnailInfo.createDate)
        : null,
      lastModifiedDate: data.blogThumbnailInfo.lastModifiedDate
        ? dayjs(data.blogThumbnailInfo.lastModifiedDate)
        : null,
    },
    tagDetailInfos: data.tagDetailInfos,
  };
});

export type TransformedBlogInfoType = z.infer<typeof transformedBlogInfoSchema>;

export const blogListSchema = z
  .object({
    blogInfos: z.array(blogInfoSchema),
    pageInfo: pageSchema,
  })
  .transform((data) => {
    return {
      blogInfos: data.blogInfos.map((blogInfo) => ({
        ...blogInfo,
        blogThumbnailInfo: {
          ...blogInfo.blogThumbnailInfo,
          displayDate: blogInfo.blogThumbnailInfo.displayDate
            ? dayjs(blogInfo.blogThumbnailInfo.displayDate)
            : null,
          createDate: blogInfo.blogThumbnailInfo.createDate
            ? dayjs(blogInfo.blogThumbnailInfo.createDate)
            : null,
          lastModifiedDate: blogInfo.blogThumbnailInfo.lastModifiedDate
            ? dayjs(blogInfo.blogThumbnailInfo.lastModifiedDate)
            : null,
        },
        tagDetailInfos: blogInfo.tagDetailInfos,
      })),
      pageInfo: data.pageInfo,
    };
  });

export const blogTagSchema = z.object({
  tagDetailInfos: tagDetailSchema,
});

export const blogRatingSchema = z
  .object({
    ratingInfos: z.array(
      z.object({
        id: z.number(),
        title: z.string().nullable().optional(),
        content: z.string().nullable().optional(),
        score: z.number().nullable().optional(),
        createDate: z.string().nullable().optional(),
        lastModifiedDate: z.string().nullable().optional(),
      }),
    ),
  })
  .transform((data) => {
    return {
      ratingInfos: data.ratingInfos.map((ratingInfo) => ({
        ...ratingInfo,
        createDate: ratingInfo.createDate ? dayjs(ratingInfo.createDate) : null,
        lastModifiedDate: ratingInfo.lastModifiedDate
          ? dayjs(ratingInfo.lastModifiedDate)
          : null,
      })),
    };
  });
