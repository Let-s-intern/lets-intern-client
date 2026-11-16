'use client';

import Heading2 from '@/common/header/Heading2';
import { ExternalBlogReview, ProgramBlogReview } from '@/types/interface';
import Link from 'next/link';
import { MdChevronRight } from 'react-icons/md';
import BlogReviewsCarousel from './BlogReviewsCarousel';
import { buildBlogReviewCards } from './utils/blogReviewUtils';

const ChallengeDetailBlogReviewSection = ({
  review,
  externalBlogReviews = [],
}: {
  review?: ProgramBlogReview;
  externalBlogReviews?: ExternalBlogReview[];
}) => {
  const cards = buildBlogReviewCards(externalBlogReviews, review?.list ?? []);

  if (cards.length === 0) return null;

  return (
    <section className="flex w-full flex-col items-center bg-neutral-95 pb-[70px] pt-[30px] md:pb-[200px] md:pt-[100px]">
      <div className="mb-6 w-full max-w-[1137px] px-5 md:mb-[70px] md:px-10 lg:px-0">
        <div className="relative mb-3 flex items-start justify-between md:mb-7 md:block">
          <Heading2 className="text-small20 md:text-center md:text-xlarge28">
            참여자들의
            <br /> 생생한 후기를 더 만나보세요
          </Heading2>
          <Link
            href="/blog/list"
            target="_blank"
            className="mt-1 flex items-center whitespace-nowrap text-xsmall14 font-medium text-neutral-35 md:absolute md:right-0 md:top-0"
          >
            더보기
            <MdChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
      <BlogReviewsCarousel reviews={cards} />
    </section>
  );
};

export default ChallengeDetailBlogReviewSection;
