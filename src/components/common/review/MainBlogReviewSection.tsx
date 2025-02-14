'use client';

import { useGetBlogReviewList } from '@/api/review';
import LoadingContainer from '../ui/loading/LoadingContainer';
import MoreHeader from '../ui/MoreHeader';
import ReviewLinkCard from './ReviewLinkCard';

function MainBlogReviewSection() {
  const { data, isLoading } = useGetBlogReviewList({
    page: 1,
    size: 4,
  });

  return (
    <section className="py-9 md:p-0">
      <MoreHeader
        title="블로그 후기"
        subtitle={data ? `${data.pageInfo.totalElements}개` : ''}
        href="/review/blog"
      />
      {isLoading ? (
        <LoadingContainer className="h-[45rem] md:h-[24rem]" />
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4 md:gap-5 md:gap-y-6">
          {data?.reviewList.map((review) => (
            <ReviewLinkCard
              className="blog_review"
              imgClassName="border border-neutral-80"
              key={review.blogReviewId}
              date={review.postDate}
              title={review.title ?? undefined}
              description={review.description}
              thumbnail={review.thumbnail}
              externalLink={review.url}
              programTitle={review.programTitle}
              programType={review.programType}
              url={review.url}
              {...(review.url && {
                favicon: new URL(review.url).origin + '/favicon.ico',
              })}
              data-program-type={review.programType}
              data-program-name={review.programTitle}
              data-review-type={`${review.programType}_REVIEW`}
              data-blog-name={review.title}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default MainBlogReviewSection;
