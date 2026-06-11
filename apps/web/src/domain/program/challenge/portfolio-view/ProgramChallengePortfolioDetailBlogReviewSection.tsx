'use client';

import { ProgramType } from '@/types/common';
import { ExternalBlogReview, ProgramBlogReview } from '@/types/interface';
import Link from 'next/link';
import { MdChevronRight } from 'react-icons/md';
import { Break } from '../../../../common/Break';
import Heading2 from '../../../../common/header/Heading2';
import BlogReviewsCarousel from '../BlogReviewsCarousel';
import { buildBlogReviewCards } from '../utils/blogReviewUtils';

const ProgramChallengePortfolioDetailBlogReviewSection = ({
  review,
  externalBlogReviews = [],
  // programType is kept for API compatibility
}: {
  review?: ProgramBlogReview;
  externalBlogReviews?: ExternalBlogReview[];
  programType: ProgramType;
}) => {
  const cards = buildBlogReviewCards(externalBlogReviews, review?.list ?? []);

  if (cards.length === 0) return null;

  return (
    <div className="flex w-full flex-col items-center bg-[#1A2A5D] pb-16 md:pb-32">
      <div className="mb-6 w-full max-w-[1137px] px-5 md:mb-[70px] md:px-10 lg:px-0">
        <div className="relative mb-3 flex items-start justify-between pt-16 md:mb-7 md:block md:pt-32">
          <Heading2 className="text-small20 md:text-xlarge28 text-white md:text-center">
            그리고 이 기세 그대로 서류 넣어서
            <Break />
            실제로 <span className="text-[#FFCE5B]">합격</span>까지 달성하자!
          </Heading2>
          <Link
            href="/blog/list"
            target="_blank"
            className="text-xsmall14 mt-1 flex items-center whitespace-nowrap font-medium text-neutral-50 md:absolute md:right-0 md:top-0"
          >
            더보기
            <MdChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
      <BlogReviewsCarousel reviews={cards} />
    </div>
  );
};

export default ProgramChallengePortfolioDetailBlogReviewSection;
