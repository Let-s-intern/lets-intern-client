'use client';

import { ProgramType } from '@/types/common';
import { ExternalBlogReview, ProgramBlogReview } from '@/types/interface';
import { useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { MdChevronRight } from 'react-icons/md';
import 'swiper/css';
import { FreeMode, Mousewheel, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Break } from '../../../../common/Break';
import Heading2 from '../../../../common/header/Heading2';

function maskName(name: string): string {
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

const BlogReviewCard = ({
  thumbnail,
  label,
  href,
  isExternal,
}: {
  thumbnail: string;
  label: string;
  href: string;
  isExternal: boolean;
}) => {
  const imageBlock = (
    <div className="group relative aspect-[327/208] w-full overflow-hidden">
      <img
        src={thumbnail}
        alt={label}
        className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
      />
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-3 overflow-hidden rounded-md bg-white px-[22px] py-5">
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {imageBlock}
        </a>
      ) : (
        <Link href={href} target="_blank">
          {imageBlock}
        </Link>
      )}
      <span className="text-xsmall14 text-neutral-30 line-clamp-1 w-full text-start font-normal tracking-[-0.02px]">
        {label}
      </span>
    </div>
  );
};

const ProgramChallengePortfolioDetailBlogReviewSection = ({
  review,
  externalBlogReviews = [],
  // programType is kept for API compatibility
}: {
  review?: ProgramBlogReview;
  externalBlogReviews?: ExternalBlogReview[];
  programType: ProgramType;
}) => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const internalList = review?.list ?? [];

  const MAX = 3;
  const externalSlice = externalBlogReviews.slice(0, MAX);
  const internalSlice = internalList.slice(0, MAX - externalSlice.length);

  const cards = [
    ...externalSlice.map((item, idx) => ({
      key: `ext-${idx}`,
      thumbnail: item.thumbnail,
      label: `${item.programTitle} / ${maskName(item.name)}`,
      href: item.url,
      isExternal: true,
    })),
    ...internalSlice.map((item) => ({
      key: `int-${item.id}`,
      thumbnail: item.thumbnail,
      label: item.title,
      href: `/blog/${item.id}`,
      isExternal: false,
    })),
  ];

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

      {isMobile ? (
        <div className="w-full overflow-x-hidden">
          <Swiper
            spaceBetween={12}
            slidesPerView="auto"
            centeredSlides
            freeMode={false}
            mousewheel
            scrollbar
            modules={[FreeMode, Scrollbar, Mousewheel]}
            className="marketing-swiper w-full"
          >
            {cards.map((card) => (
              <SwiperSlide key={card.key} className="!w-[300px]">
                <BlogReviewCard {...card} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="flex w-full max-w-[1137px] gap-3 px-10 lg:px-0">
          {cards.map((card) => (
            <div key={card.key} className="flex-1">
              <BlogReviewCard {...card} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramChallengePortfolioDetailBlogReviewSection;
