'use client';

import { useBlogListQuery } from '@/api/blog';
import { getBlogPathname } from '@/utils/url';
import LoadingContainer from '../ui/loading/LoadingContainer';
import MoreHeader from '../ui/MoreHeader';
import ReviewLinkCard from './ReviewLinkCard';

function ProgramInterviewSection() {
  const { data, isLoading } = useBlogListQuery({
    pageable: { page: 1, size: 4 },
    type: 'PROGRAM_REVIEWS',
  });

  return (
    <section className="py-9 md:p-0">
      <MoreHeader
        title="프로그램 참여자 인터뷰"
        subtitle={data ? `${data?.pageInfo.totalElements}개` : ''}
        href="/blog/list?category=PROGRAM_REVIEWS"
      />
      {isLoading ? (
        <LoadingContainer className="h-[45rem] md:h-[24rem]" />
      ) : (
        <div className="grid grid-cols-2 mt-6 md:gap-5 md:grid-cols-4 gap-x-5 gap-y-6">
          {data?.blogInfos.map((blog) => (
            <ReviewLinkCard
              key={blog.blogThumbnailInfo.id}
              date={blog.blogThumbnailInfo.displayDate}
              title={blog.blogThumbnailInfo.title}
              description={blog.blogThumbnailInfo.description}
              thumbnail={blog.blogThumbnailInfo.thumbnail}
              externalLink={null}
              favicon={null}
              programTitle={'프로그램 후기'}
              programType={null}
              url={getBlogPathname(blog.blogThumbnailInfo)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProgramInterviewSection;
