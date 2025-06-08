import { ChallengeIdPrimitive } from '@/schema';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import MainTitle from './MainTitle';
import TestimonialCarousel from './TestimonialCarousel';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const MarketingReviewsSection: React.FC<Props> = ({ challenge }) => {
  const descParsed = (() => {
    try {
      return JSON.parse(challenge.desc || '{}');
    } catch {
      return {};
    }
  })();

  const reviews = descParsed.challengeReview || [];

  return (
    <section
      id="reviews"
      className="flex scroll-mt-[56px] flex-col items-center bg-[#F0F4FF] py-[70px] md:scroll-mt-[60px] md:py-[120px]"
    >
      <div className="mb-3 text-small20 font-bold text-[#4A76FF]">
        찐 후기 모음.zip
      </div>
      <MainTitle className="mb-10 text-center">
        {challenge.title} <br />
        참여자들의 따끈따끈한 후기
      </MainTitle>
      <div className="w-full justify-items-center overflow-x-hidden md:w-full">
        <TestimonialCarousel reviews={reviews} />
      </div>

      <div className="relative mt-16 flex flex-col items-center">
        <div className="absolute -top-6 z-10 rounded-xs bg-[#24C1F0] px-2.5 py-1.5 text-[12px] font-medium text-white md:-top-7 md:text-[14px]">
          자세한 수강생들의 후기가 궁금하다면?
        </div>
        <button
          type="button"
          className="z-1 relative flex w-[320px] items-center justify-center gap-2 rounded-sm bg-[#0C1737] px-5 py-4 text-center text-xsmall16 font-semibold text-white md:w-auto md:text-medium22"
        >
          더 다양한 후기 보러가기
          <div className="relative h-5 w-5 md:h-6 md:w-6">
            <Image
              src="/images/marketing/arrow-circle-right.svg"
              alt="arrow"
              fill
              className="object-contain"
            />
          </div>
          <Link
            className="absolute inset-0"
            href={{
              pathname: '/review/program',
              query: { program: 'challenge_review', challenge: 'marketing' },
            }}
          />
        </button>
      </div>
    </section>
  );
};

export default MarketingReviewsSection;
