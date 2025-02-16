'use client';

import { useInfiniteBlogListQuery } from '@/api/blog';
import { blogCategory } from '@/utils/convert';
import BlogCard from '@components/common/blog/BlogCard';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import BlogFilter from './common/blog/BlogFilter';
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

  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteBlogListQuery({
      type: params.get(ParamKeyEnum.type),
      pageable: { page: 1, size: 5 },
    });

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-0">
        <h2 className="text-small20 font-semibold">블로그 콘텐츠</h2>
        <BlogFilter
          label="콘텐츠 카테고리"
          list={filterList}
          paramKey={ParamKeyEnum.type}
        />
      </div>

      <div className="flex flex-col items-center">
        <InfiniteScroll
          className="w-full flex-1 gap-y-[30px]"
          hasMore={hasNextPage}
          loadMore={() => {
            fetchNextPage();
          }}
        >
          {isLoading ? (
            <LoadingContainer
              className="pb-[26rem]"
              text="블로그를 가져오는 중입니다.."
            />
          ) : (
            <div className="flex w-full flex-wrap gap-4">
              {!data || data.pages[0].blogInfos.length < 1 ? (
                <div className="w-full py-6 text-center text-neutral-40">
                  등록된 글이 없습니다.
                </div>
              ) : (
                data.pages.map((page, pageIdx) =>
                  page.blogInfos.map((blogInfo, blogIdx) => (
                    <React.Fragment key={blogInfo.blogThumbnailInfo.id}>
                      <BlogCard
                        key={blogInfo.blogThumbnailInfo.id}
                        blogInfo={blogInfo}
                      />
                      {!(
                        pageIdx === data.pages.length - 1 &&
                        blogIdx === page.blogInfos.length - 1
                      ) && (
                        <hr className="h-0.5 w-full border-t border-neutral-80" />
                      )}
                    </React.Fragment>
                  )),
                )
              )}
            </div>
          )}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default function BlogListContent() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
