'use client';

import Image from 'next/image';
import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { FreeMode, Mousewheel, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { maskingName } from '../program/program-detail/review/ProgramDetailReviewItem';

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
    <div className="h-[282px] w-[300px] rounded-md bg-static-100 p-5 shadow-sm md:w-[371px]">
      <div className="mb-3 flex w-fit items-center rounded-xs bg-[#F0F4FF] px-2 py-1.5">
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
      <div className="h-[168px] text-neutral-0">
        <p className="mb-2 line-clamp-2 break-keep text-xsmall16 font-bold md:text-small20">
          {title}
        </p>
        <p
          className="text-xsmall14 font-medium leading-relaxed md:text-xsmall16"
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
      </div>
      <div className="mt-4 font-normal text-neutral-50 md:text-xsmall14">
        {meta}
      </div>
    </div>
  );
};

const TestimonialCarousel: React.FC<Props> = ({ reviews }) => {
  return (
    <Swiper
      spaceBetween={12}
      slidesPerView={'auto'}
      centeredSlides={true}
      scrollbar={true}
      mousewheel={true}
      freeMode={true}
      modules={[FreeMode, Scrollbar, Mousewheel]}
      className="w-full"
    >
      {reviews.map((item, idx) => {
        const highlights = item.content.includes(HIGHLIGHT_KEYWORD)
          ? [HIGHLIGHT_KEYWORD]
          : [];
        const meta = `${maskingName(item.name)} / ${item.passedState}`;
        return (
          <SwiperSlide key={idx} className="mx-auto !w-[300px] md:!w-[371px]">
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
  );
};

export default TestimonialCarousel;
