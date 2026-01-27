import SectionHeader from '@/common/header/SectionHeader';
import { ChallengeIdPrimitive } from '@/schema';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import MainTitle from '../ui/MainTitle';
import TestimonialCarousel from './TestimonialCarousel';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const HrReviewSection: React.FC<Props> = ({ challenge }) => {
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
      className="flex scroll-mt-[56px] flex-col items-center bg-neutral-80 py-[60px] md:scroll-mt-[60px] md:py-[93px]"
    >
      <SectionHeader className="hidden w-full pl-5 text-left md:mb-[42px] md:block md:pl-0 md:text-center">
        후기
      </SectionHeader>
      <MainTitle className="mb-10 text-center md:mb-[98px]">
        챌린지를 마치면 <br className="md:hidden" />
        이런 결과물을 얻게 됩니다
      </MainTitle>
      <div className="w-full">
        <TestimonialCarousel reviews={reviews} />
      </div>

      <div className="mt-[37px] flex flex-col items-center">
        <div className="relative mb-[15px] flex items-center md:mb-3">
          <div className="rounded-xs bg-[#FF9B61] px-2.5 py-1.5 text-[12px] font-medium text-white md:text-[14px]">
            자세한 수강생들의 후기가 궁금하다면?
          </div>
          <img
            src="/images/hr-reviewbubble-tail.svg"
            alt=""
            className="absolute -bottom-2 left-1/2 h-[20px] w-[20px] -translate-x-1/2"
          />
        </div>
        <button
          type="button"
          className="z-1 relative flex w-[272px] items-center justify-center gap-2 rounded-sm bg-[#F55A00] px-5 py-4 text-center text-xsmall16 font-semibold text-white md:w-[320px] md:w-auto md:text-medium22"
        >
          더 다양한 후기 보러가기
          <div className="relative h-5 w-5 md:h-6 md:w-6">
            <Image
              src="/images/hr-arrow-circle-right.svg"
              alt="arrow"
              fill
              className="object-contain"
            />
          </div>
          <Link
            className="absolute inset-0"
            href={{
              pathname: '/review/program',
              query: { program: 'challenge_review', challenge: 'hr' },
            }}
          />
        </button>
      </div>
    </section>
  );
};

export default HrReviewSection;
