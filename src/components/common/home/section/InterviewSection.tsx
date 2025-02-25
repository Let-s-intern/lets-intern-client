import { BlogType, useBlogListQuery } from '@/api/blog';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { blogCategory } from '@/utils/convert';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import BlogContainer from '../BlogContainer';

const InterviewSection = () => {
  const { data, isLoading } = useBlogListQuery({
    pageable: { page: 1, size: 4 },
    types: [BlogType.JOB_SUCCESS_STORIES],
  });

  return (
    <>
      <section className="mt-16 w-full max-w-[1160px] px-5 md:mt-24 md:px-0">
        {isLoading ? (
          <LoadingContainer />
        ) : !data || data.blogInfos.length === 0 ? null : (
          <BlogContainer
            title="렛츠커리어 챌린지부터 합격까지"
            subTitle={
              <>
                챌린지에 참여한 이들이 들려주는 <br className="md:hidden" />
                성공의 비결을 확인하세요!
              </>
            }
            moreUrl="/blog/list?type=job_success_stories"
            blogs={data.blogInfos.map((blog) => ({
              thumbnail: blog.blogThumbnailInfo.thumbnail || '',
              category: blog.blogThumbnailInfo.category
                ? blogCategory[blog.blogThumbnailInfo.category]
                : '-',
              title: blog.blogThumbnailInfo.title || '',
              date: blog.blogThumbnailInfo.createDate
                ? dayjs(blog.blogThumbnailInfo.createDate).format(YYYY_MM_DD)
                : '-',
              url: `/blog/${blog.blogThumbnailInfo.id}`,
            }))}
          />
        )}
      </section>
    </>
  );
};

export default InterviewSection;
