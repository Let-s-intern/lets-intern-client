import { ChallengeIdPrimitive } from '@/schema';
import Image from '@/common/ui/Image';
import { Link } from 'react-router-dom';
import React from 'react';
import MainTitle from '../ui/MainTitle';
import BlogReviewsCarousel from './BlogReviewsCarousel';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const MarketingReviewsSection: React.FC<Props> = ({ challenge }) => {
  const BLOG_REVIEWS = [
    {
      writer: 'happyse*** / 첫 취업준비생',
      image: '/images/marketing/blog-review1.png',
      url: 'https://blog.naver.com/happyseed3/223959922519',
    },
    {
      writer: 'ysa0*** / 첫 마케팅 취업준비생',
      image: '/images/marketing/blog-review2.png',
      url: 'https://blog.naver.com/ysa0419/223809174754',
    },
    {
      writer: 'wldu*** / 취업준비 n년차 / 현직자 피드백',
      image: '/images/marketing/blog-review3.png',
      url: 'https://blog.naver.com/wldusyi/224109699677',
    },
  ];

  return (
    <section
      id="reviews"
      className="flex scroll-mt-[56px] flex-col items-center bg-[#F0F4FF] py-[70px] md:scroll-mt-[60px] md:py-[120px]"
    >
      <div className="mb-3 text-small20 font-bold text-[#4A76FF]">
        찐 후기 모음.zip
      </div>
      <MainTitle className="mb-[50px] text-center">
        {challenge.title} <br />
        이전 기수 참여자들의 블로그 후기
      </MainTitle>
      <div className="flex w-full items-center justify-center overflow-x-hidden">
        <BlogReviewsCarousel reviews={BLOG_REVIEWS} />
      </div>

      <div className="relative mt-20 flex flex-col items-center">
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
            to={{
              pathname: '/review/blog',
              query: { type: 'challenge' },
            }}
          />
        </button>
      </div>
    </section>
  );
};

export default MarketingReviewsSection;
