'use client';

import { useBlogListQuery } from '@/api/blog/blog';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { blogCategory } from '@/utils/convert';
import BlogContainer from './BlogContainer';

const CurrentBlogSection = () => {
  const { data, isLoading } = useBlogListQuery({
    pageable: { page: 1, size: 20 },
  });

  return (
    <>
      <section className="mt-16 w-full max-w-[1120px] px-5 md:mt-24 xl:px-0">
        {isLoading ? (
          <LoadingContainer />
        ) : !data || data.blogInfos.length === 0 ? null : (
          <BlogContainer
            gaItem="home_blogrec"
            title="지금 가장 인기있는\n블로그 게시글"
            gaTitle="지금 가장 인기있는 블로그 게시글"
            subTitle={
              <>
                렛츠커리어 블로그에서 사람들이 <br className="md:hidden" />
                가장 많이 읽은 콘텐츠를 확인해보세요!
              </>
            }
            moreUrl="/blog/list"
            blogs={data.blogInfos
              .filter(
                (b) =>
                  b.blogThumbnailInfo.isDisplayed &&
                  b.blogThumbnailInfo.displayDate &&
                  dayjs(b.blogThumbnailInfo.displayDate).isBefore(dayjs()),
              )
              .slice(0, 4)
              .map((blog) => ({
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
        )}
      </section>
    </>
  );
};

export default CurrentBlogSection;
