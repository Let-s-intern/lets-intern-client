'use client';

import { useBlogListQuery } from '@/api/blog';
import BellIcon from '@/assets/icons/Bell.svg';
import LockKeyHoleIcon from '@/assets/icons/lock-keyhole.svg';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { blogCategory } from '@/utils/convert';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import BlogCard from './common/blog/BlogCard';
import BlogFilter from './common/blog/BlogFilter';
import BaseButton from './common/ui/button/BaseButton';
import LoadingContainer from './common/ui/loading/LoadingContainer';

const filterList = Object.entries(blogCategory).map(([key, value]) => ({
  caption: value,
  value: key,
}));

// 블로그 목록 조회 API에서 사용하는 쿼리 파라미터 key
const ParamKeyEnum = {
  type: 'type',
} as const;

const Content = () => {
  const params = useSearchParams();

  return (
    <>
      <div className="mb-6 flex flex-col gap-6 md:mb-8 md:flex-row md:items-center md:justify-between md:gap-0">
        <h2 className="text-small20 font-semibold">블로그 콘텐츠</h2>
        <BlogFilter
          label="콘텐츠 카테고리"
          list={filterList}
          paramKey={ParamKeyEnum.type}
        />
      </div>

      <div className="flex flex-col items-center">
        <BlogList type={params.get(ParamKeyEnum.type)} />
      </div>
    </>
  );
};

function BlogList({ type }: { type?: string | null }) {
  const { data, isLoading } = useBlogListQuery({
    pageable: { page: 1, size: 6 },
    type,
  });

  // 공개 예정 여부
  const willBePublished = (date: string) => dayjs(date).isAfter(dayjs());

  if (isLoading)
    return (
      <LoadingContainer
        className="pb-[60vh]"
        text="블로그를 가져오는 중입니다.."
      />
    );

  return (
    <div className="grid grid-cols-1 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-[4.25rem]">
      {data?.blogInfos.map(({ blogThumbnailInfo }) => (
        <BlogCard
          key={blogThumbnailInfo.id}
          title={blogThumbnailInfo.title ?? ''}
          superTitle={
            blogThumbnailInfo.category
              ? blogCategory[blogThumbnailInfo.category]
              : '전체'
          }
          thumbnailItem={
            <>
              <img
                className="h-full w-full object-cover"
                src={blogThumbnailInfo.thumbnail ?? undefined}
                alt={blogThumbnailInfo.title ?? undefined}
              />
              {willBePublished(blogThumbnailInfo.displayDate ?? '') && (
                <div className="absolute inset-0 flex justify-end bg-black/30 p-3">
                  <div className="flex h-fit w-fit items-center rounded-full bg-white/50 py-1 pl-1 pr-1.5">
                    <LockKeyHoleIcon width={16} height={16} />
                    <span className="text-xxsmall12 font-semibold text-[#484848]">
                      공개예정
                    </span>
                  </div>
                </div>
              )}
            </>
          }
          date={
            blogThumbnailInfo.displayDate
              ? `${dayjs(blogThumbnailInfo.displayDate).format(YYYY_MM_DD)} 작성`
              : undefined
          }
          buttonItem={
            willBePublished(blogThumbnailInfo.displayDate ?? '') ? (
              <BaseButton
                variant="point"
                className="flex items-center gap-1 rounded-xs p-2.5 text-xxsmall12 font-medium"
              >
                <BellIcon width={16} height={16} />
                <span>공개 예정</span>
              </BaseButton>
            ) : null
          }
        />
      ))}
    </div>
  );
}

export default function BlogListContent() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
