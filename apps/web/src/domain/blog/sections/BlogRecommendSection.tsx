'use client';

import { blogListQueryOptions } from '@/api/blog/blog';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import ContentCard from '@/common/card/ContentCard';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { blogCategory } from '@/utils/convert';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import LoadingContainer from '../../../common/loading/LoadingContainer';

const willBePublished = (date: string) => dayjs(date).isAfter(dayjs());

export function BlogRecommendSection() {
  return (
    <AsyncBoundary pendingFallback={<LoadingContainer />}>
      <BlogRecommendContent />
    </AsyncBoundary>
  );
}

function BlogRecommendContent() {
  const { data } = useSuspenseQuery(
    blogListQueryOptions({ pageable: { page: 1, size: 10 } }),
  );

  const displayedBlogInfos = useMemo(
    () =>
      data.blogInfos
        .filter(
          ({ blogThumbnailInfo }) =>
            blogThumbnailInfo.displayDate &&
            !willBePublished(blogThumbnailInfo.displayDate),
        )
        .slice(0, 4),
    [data],
  );

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-5">
      {displayedBlogInfos.map(({ blogThumbnailInfo }) => (
        <ContentCard
          key={blogThumbnailInfo.id}
          href={`/blog/${blogThumbnailInfo.id}`}
          className="blog_empty_recommended cursor-pointer"
          containerProps={{
            'data-url': `/blog/${blogThumbnailInfo.id}`,
            'data-text': blogThumbnailInfo.title,
          }}
          category={
            blogThumbnailInfo.category
              ? blogCategory[blogThumbnailInfo.category]
              : '전체'
          }
          title={blogThumbnailInfo.title ?? ''}
          thumbnail={
            blogThumbnailInfo.thumbnail ? (
              <img
                className="h-full w-full object-cover"
                src={blogThumbnailInfo.thumbnail}
                alt={blogThumbnailInfo.title ?? undefined}
              />
            ) : null
          }
          date={
            blogThumbnailInfo.displayDate
              ? dayjs(blogThumbnailInfo.displayDate).format(YYYY_MM_DD) +
                ' 작성'
              : undefined
          }
        />
      ))}
    </div>
  );
}
