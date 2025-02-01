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
        subtitle={data ? `${data?.reviewList.length}개` : ''}
        href="/review/blog"
      />
      {isLoading ? (
        <LoadingContainer className="h-[45rem] md:h-[24rem]" />
      ) : (
        <div className="grid grid-cols-2 mt-6 md:gap-5 md:grid-cols-4 gap-x-5 gap-y-6">
          {data?.reviewList.map((review) => (
            <ReviewLinkCard
              key={review.blogReviewId}
              date={review.postDate}
              title={review.title}
              description={review.description}
              thumbnail={review.thumbnail}
              externalLink={review.url}
              favicon={null}
              programTitle={review.programTitle}
              programType={review.programType}
              url={review.url}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default MainBlogReviewSection;
