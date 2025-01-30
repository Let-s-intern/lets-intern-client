'use client';

import { useState } from 'react';

import { useGetBlogReviewList } from '@/api/review';
import { ProgramTypeUpperCase } from '@/schema';
import MuiPagination from '@components/common/program/pagination/MuiPagination';
import BlogReviewCard from '@components/common/review/BlogReviewCard';

const PAGE_SIZE = 10;

interface Props {
  types?: ProgramTypeUpperCase[];
}

function BlogReviewListSection({ types = [] }: Props) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetBlogReviewList({
    page,
    size: PAGE_SIZE,
    types,
  });

  if (isLoading) return <p className="text-center text-xsmall14">로딩 중...</p>;
  if (data?.reviewList.length === 0)
    return <p className="text-center text-xsmall14">작성된 후기가 없습니다</p>;

  return (
    <section className="mb-12">
      <div className="flex flex-col gap-6 mb-8">
        {data?.reviewList.map((review) => (
          <BlogReviewCard key={review.blogReviewId} blogReview={review} />
        ))}
      </div>

      <div className="flex justify-center">
        {data?.pageInfo && (
          <MuiPagination
            pageInfo={data.pageInfo}
            page={page}
            onChange={(_, page) => setPage(page)}
          />
        )}
      </div>
    </section>
  );
}

export default BlogReviewListSection;
