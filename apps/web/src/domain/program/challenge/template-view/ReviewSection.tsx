import ArrowCircleRight from '@/assets/icons/arrow-circle-right.svg';
import ReviewBubbleTail from '@/assets/icons/review-bubble-tail.svg';
import SectionHeader from '@/common/header/SectionHeader';
import { ChallengeContent } from '@/types/interface';
import Link from 'next/link';
import MainTitle from '../ui/MainTitle';
import TestimonialCarousel from './TestimonialCarousel';
import { ReviewSectionConfig } from './types';

interface Props {
  config: ReviewSectionConfig;
  content: ChallengeContent | null;
}

function ReviewSection({ config, content }: Props) {
  const reviews = content?.challengeReview ?? [];
  const {
    primaryColor,
    lightAccentColor,
    reviewLinkQuery,
    bubbleBgColor,
    buttonBgColor,
  } = config;

  return (
    <section
      id="reviews"
      className="bg-neutral-80 flex scroll-mt-[56px] flex-col items-center py-[60px] md:scroll-mt-[60px] md:py-[93px]"
    >
      <SectionHeader className="hidden w-full pl-5 text-left md:mb-[42px] md:block md:pl-0 md:text-center">
        후기
      </SectionHeader>
      <MainTitle className="mb-10 text-center md:mb-[98px]">
        챌린지를 마치면 <br className="md:hidden" />
        이런 결과물을 얻게 됩니다
      </MainTitle>
      <div className="w-full">
        <TestimonialCarousel
          reviews={reviews}
          starBadgeBgColor={lightAccentColor}
          starColor={primaryColor}
        />
      </div>

      <div className="mt-[37px] flex flex-col items-center">
        <div className="relative mb-[15px] flex items-center md:mb-3">
          <div
            className="rounded-xs px-2.5 py-1.5 text-[12px] font-medium text-white md:text-[14px]"
            style={{ backgroundColor: bubbleBgColor }}
          >
            자세한 수강생들의 후기가 궁금하다면?
          </div>
          <ReviewBubbleTail
            className="absolute -bottom-2 left-1/2 h-[20px] w-[20px] -translate-x-1/2"
            style={{ color: bubbleBgColor }}
            aria-hidden="true"
          />
        </div>
        <button
          type="button"
          className="z-1 text-xsmall16 md:text-medium22 relative flex w-[272px] items-center justify-center gap-2 rounded-sm px-5 py-4 text-center font-semibold text-white md:w-[320px]"
          style={{ backgroundColor: buttonBgColor }}
        >
          더 다양한 후기 보러가기
          <ArrowCircleRight
            className="h-5 w-5 md:h-6 md:w-6"
            aria-hidden="true"
          />
          <Link
            className="absolute inset-0"
            href={{ pathname: '/review/program', query: reviewLinkQuery }}
          />
        </button>
      </div>
    </section>
  );
}

export default ReviewSection;
