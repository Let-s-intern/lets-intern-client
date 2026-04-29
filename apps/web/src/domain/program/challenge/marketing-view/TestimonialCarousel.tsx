'use client';

import { useMediaQuery } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { FreeMode, Mousewheel, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { maskingName } from '../../program-detail/review/ProgramDetailReviewItem';

interface ReviewItem {
  name: string;
  programName: string;
  passedState: string;
  title: string;
  content: string;
}

interface Props {
  reviews: ReviewItem[];
}

const HIGHLIGHT_KEYWORD = '내용';

const TestimonialCard = ({
  title,
  content,
  highlights = [],
  meta,
}: {
  title: string;
  content: string;
  highlights?: string[];
  meta: string;
}) => {
  const highlightedContent = highlights.reduce((acc, phrase) => {
    return acc.replace(
      phrase,
      `<span class="text-[#2B66F6] font-semibold">${phrase}</span>`,
    );
  }, content);

  return (
    <div className="bg-static-100 min-h-[282px] w-[300px] rounded-md p-5 shadow-sm md:w-[371px]">
      <div className="rounded-xs mb-3 flex w-fit items-center bg-[#F0F4FF] px-2 py-1.5">
        {[...Array(5)].map((_, idx) => (
          <Image
            key={idx}
            src="/images/marketing/star.svg"
            alt="star"
            width={16}
            height={16}
          />
        ))}
      </div>
      <div className="text-neutral-0 min-h-[210px]">
        <p className="text-xsmall16 md:text-small20 mb-2 line-clamp-2 break-keep font-bold">
          {title}
        </p>
        <p className="text-xsmall14 md:text-xsmall16 whitespace-pre-line font-medium leading-relaxed">
          {content}
        </p>
      </div>
      <div className="md:text-xsmall14 mt-4 font-normal text-neutral-50">
        {meta}
      </div>
    </div>
  );
};

const TestimonialCarousel: React.FC<Props> = ({ reviews }) => {
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <div className="max-w-[1000px] px-5 md:px-[60px]">
      <Swiper
        spaceBetween={12}
        slidesPerView="auto"
        centeredSlides={isMobile ? true : false}
        freeMode={false}
        initialSlide={0}
        mousewheel={true}
        scrollbar={true}
        modules={[FreeMode, Scrollbar, Mousewheel]}
        className="marketing-swiper w-full"
      >
        {reviews.map((item, idx) => {
          const highlights = item.content.includes(HIGHLIGHT_KEYWORD)
            ? [HIGHLIGHT_KEYWORD]
            : [];
          const meta = `${maskingName(item.name)} / ${item.passedState}`;

          return (
            <SwiperSlide key={idx} className="!w-[300px] md:!w-[371px]">
              <TestimonialCard
                title={item.title}
                content={item.content}
                highlights={highlights}
                meta={meta}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TestimonialCarousel;
