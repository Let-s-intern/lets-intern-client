'use client';

import { useGetBlogReviewList } from '@/api/review';
import { ProgramTypeUpperCase } from '@/schema';
import BlogReviewCard from '@components/common/review/BlogReviewCard';

interface Props {
  types?: ProgramTypeUpperCase[];
}

function BlogReviewListSection({ types = [] }: Props) {
  const { data, isLoading } = useGetBlogReviewList({
    page: 1,
    size: 10,
    types,
  });

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <section className="flex flex-col gap-6">
      {data?.map((review) => (
        <BlogReviewCard key={review.blogReviewId} blogReview={review} />
      ))}
    </section>
  );
}

export default BlogReviewListSection;
