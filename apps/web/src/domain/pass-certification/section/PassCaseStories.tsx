'use client';

import { BlogType, blogListQueryOptions } from '@/api/blog/blog';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import BlogContainer from '@/domain/home/blog/BlogContainer';
import dayjs from '@/lib/dayjs';
import { blogCategory } from '@/utils/convert';
import { useSuspenseQuery } from '@tanstack/react-query';

/** 합격자 섹션 - 합격 후기(career_stories */
export default function PassCaseStories() {
  const { data } = useSuspenseQuery(
    blogListQueryOptions({
      pageable: { page: 1, size: 4 },
      types: [BlogType.CAREER_STORIES],
    }),
  );

  return (
    <div className="bg-primary-5 border-primary-40 flex w-full rounded-lg border p-5 md:p-8">
      <BlogContainer
        gaItem="pass_blogreview"
        title={
          <>
            렛츠커리어 챌린지부터 <br className="md:hidden" />
            합격까지
          </>
        }
        gaTitle="합격자들의 생생한 합격 후기"
        subTitle={
          <>
            챌린지에 참여한 이들이 들려주는 <br className="md:hidden" />
            성공의 비결을 확인하세요!
          </>
        }
        moreUrl="/blog/list?type=career_stories"
        blogs={data.blogInfos.map((blog) => ({
          thumbnail: blog.blogThumbnailInfo.thumbnail || '',
          category: blog.blogThumbnailInfo.category
            ? blogCategory[blog.blogThumbnailInfo.category]
            : '-',
          title: blog.blogThumbnailInfo.title || '',
          date: blog.blogThumbnailInfo.displayDate
            ? dayjs(blog.blogThumbnailInfo.displayDate).format(YYYY_MM_DD)
            : '-',
          url: `/blog/${blog.blogThumbnailInfo.id}`,
        }))}
      />
    </div>
  );
}
