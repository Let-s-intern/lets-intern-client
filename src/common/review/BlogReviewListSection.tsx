'use client';

import { useGetBlogReviewList } from '@/api/review';
import BlogReviewCard from '@/common/review/BlogReviewCard';
import MuiPagination from '@/domain/program/pagination/MuiPagination';
import { ProgramTypeUpperCase } from '@/schema';
import { useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import LoadingContainer from '../loading/LoadingContainer';

const PAGE_SIZE = 10;

interface Props {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

function BlogReviewListSection({ page, setPage }: Props) {
  const searchParams = useSearchParams();
  const { data, isLoading } = useGetBlogReviewList({
    page,
    size: PAGE_SIZE,
    types: searchParams
      .get('type')
      ?.toUpperCase()
      .split(',') as ProgramTypeUpperCase[],
  });

  if (isLoading) return <LoadingContainer className="h-[50vh]" />;
  if (data?.reviewList.length === 0)
    return <p className="text-center text-xsmall14">작성된 후기가 없습니다</p>;

  return (
    <section>
      <div className="mb-8 flex flex-col gap-6 md:mb-12">
        {data?.reviewList.map((review) => (
          <BlogReviewCard
            key={review.blogReviewId}
            blogReview={review}
            className="blog_review"
          />
        ))}
      </div>

      <div className="flex justify-center">
        {data?.pageInfo && (
          <MuiPagination
            pageInfo={data.pageInfo}
            page={page}
            onChange={(_, page) => {
              setPage(page);
              window.scroll({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>
    </section>
  );
}

export default BlogReviewListSection;
