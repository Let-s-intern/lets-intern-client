'use client';

import { BlogType, blogListQueryOptions } from '@/api/blog/blog';
import { getBlogPathname } from '@/utils/url';
import MoreHeader from '@/common/header/MoreHeader';
import ReviewLinkCard from '@/domain/review/ui/ReviewLinkCard';
import { useSuspenseQuery } from '@tanstack/react-query';

function ProgramInterviewSection() {
  const { data } = useSuspenseQuery(
    blogListQueryOptions({
      pageable: { page: 1, size: 4 },
      types: [BlogType.PROGRAM_REVIEWS],
    }),
  );

  return (
    <section className="py-9 md:p-0">
      <MoreHeader
        subtitle={data ? `${data?.pageInfo.totalElements}개` : ''}
        href="/blog/list?type=PROGRAM_REVIEWS"
        gaText="프로그램 참여자 인터뷰"
      >
        프로그램 참여자 인터뷰
      </MoreHeader>
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
    </section>
  );
}

export default ProgramInterviewSection;
