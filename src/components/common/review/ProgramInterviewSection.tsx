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
        subtitle={data ? `${data?.pageInfo.totalElements}개` : ''}
        href="/blog/list?category=PROGRAM_REVIEWS"
      >
        프로그램 참여자 인터뷰
      </MoreHeader>
      {isLoading ? (
        <LoadingContainer className="h-[45rem] md:h-[24rem]" />
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4 md:gap-5 md:gap-y-6">
          {data?.blogInfos.map((blog) => (
            <ReviewLinkCard
              className="interview_review"
              key={blog.blogThumbnailInfo.id}
              date={blog.blogThumbnailInfo.displayDate}
              title={blog.blogThumbnailInfo.title ?? undefined}
              description={blog.blogThumbnailInfo.description}
              thumbnail={blog.blogThumbnailInfo.thumbnail}
              externalLink={null}
              favicon={null}
              programTitle={'프로그램 후기'}
              programType={null}
              url={getBlogPathname(blog.blogThumbnailInfo)}
              data-review-type="PROGRAM_REVIEWS"
              data-blog-name={blog.blogThumbnailInfo.title}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProgramInterviewSection;
