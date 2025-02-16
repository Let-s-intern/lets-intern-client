import { useInfiniteBlogListQuery } from '@/api/blog';
import BlogCard from '@/components/common/blog/BlogCard';
import BlogCategoryTag from '@/components/common/blog/BlogCategoryTag';
import { blogCategory } from '@/utils/convert';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

const BlogListPage = () => {
  const params = new URLSearchParams(window.location.search);
  const [category, setCategory] = useState<string | null>(
    params.get('category'),
  );
  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteBlogListQuery({
      type: category,
      pageable: { page: 1, size: 5 },
    });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [category]);

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="flex w-full items-center justify-center gap-y-1 bg-blog-banner-sm py-10 md:bg-blog-banner-md lg:bg-blog-banner-lg">
        <div className="flex w-full max-w-[1200px] flex-col gap-y-1 px-[25px] md:gap-y-2 md:px-[140px]">
          <h1 className="text-xl font-bold text-neutral-100">
            {category !== null ? blogCategory[category] : '렛츠커리어 블로그'}
          </h1>
          <p className="text-xsmall14 text-white/85">
            렛츠커리어의 독자적인 커리어 교육 콘텐츠를 확인해보세요.
          </p>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 md:px-20 lg:px-10">
        <div className="flex w-full flex-1 flex-col items-center md:px-[100px] md:pb-10">
          <div className="flex w-full flex-col items-center gap-y-8 pb-8 pt-5 md:py-8">
            <div className="flex w-full flex-wrap gap-2 py-2">
              <BlogCategoryTag
                category="전체"
                isClicked={!category}
                onClick={() => setCategory(null)}
              />
              <BlogCategoryTag
                category={blogCategory['LETSCAREER_NEWS']}
                isClicked={category === 'LETSCAREER_NEWS'}
                onClick={() => setCategory('LETSCAREER_NEWS')}
              />
              <BlogCategoryTag
                category={blogCategory['PROGRAM_REVIEWS']}
                isClicked={category === 'PROGRAM_REVIEWS'}
                onClick={() => setCategory('PROGRAM_REVIEWS')}
              />
              <BlogCategoryTag
                category={blogCategory['JOB_PREPARATION_TIPS']}
                isClicked={category === 'JOB_PREPARATION_TIPS'}
                onClick={() => setCategory('JOB_PREPARATION_TIPS')}
              />
              <BlogCategoryTag
                category={blogCategory['JOB_SUCCESS_STORIES']}
                isClicked={category === 'JOB_SUCCESS_STORIES'}
                onClick={() => setCategory('JOB_SUCCESS_STORIES')}
              />
              <BlogCategoryTag
                category={blogCategory['WORK_EXPERIENCES']}
                isClicked={category === 'WORK_EXPERIENCES'}
                onClick={() => setCategory('WORK_EXPERIENCES')}
              />
              <BlogCategoryTag
                category={blogCategory['JUNIOR_STORIES']}
                isClicked={category === 'JUNIOR_STORIES'}
                onClick={() => setCategory('JUNIOR_STORIES')}
              />
            </div>
            <InfiniteScroll
              className="w-full flex-1 gap-y-[30px]"
              hasMore={hasNextPage}
              loadMore={() => {
                fetchNextPage();
              }}
            >
              {isLoading ? (
                <div className="py-6 text-center">
                  블로그를 가져오는 중입니다..
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;
