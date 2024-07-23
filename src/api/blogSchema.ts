import dayjs from 'dayjs';
import { z } from 'zod';

export interface PostBlog {
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

export type TagDetail = z.infer<typeof tagDetailSchema>[0];

export const blogThumbnailSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  displayDate: z.string().nullable().optional(),
  createDate: z.string().nullable().optional(),
  lastModifiedDate: z.string().nullable().optional(),
});

export const tagDetailSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string().nullable().optional(),
    createDate: z.string().nullable().optional(),
    lastModifiedDate: z.string().nullable().optional(),
  }),
);

export const blogSchema = z
  .object({
    blogInfos: z.array(
      z.object({
        blogThumbnailInfo: blogThumbnailSchema,
        tagDetailInfos: tagDetailSchema,
      }),
    ),
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
        tagDetailInfos: blogInfo.tagDetailInfos.map((tagDetailInfo) => ({
          ...tagDetailInfo,
          createDate: tagDetailInfo.createDate
            ? dayjs(tagDetailInfo.createDate)
            : null,
          lastModifiedDate: tagDetailInfo.lastModifiedDate
            ? dayjs(tagDetailInfo.lastModifiedDate)
            : null,
        })),
      })),
    };
  });

export const blogTagSchema = z.object({
  tagDetailInfos: tagDetailSchema,
});
