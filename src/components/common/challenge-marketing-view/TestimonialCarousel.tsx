'use client';

import Image from 'next/image';
import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';

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
  content,
  highlights = [],
  meta,
}: {
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
      <p
        className="h-[168px] text-[14px] leading-relaxed text-neutral-0"
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
      />
      <div className="mt-4 text-[12px] text-neutral-50">{meta}</div>
    </div>
  );
};

const TestimonialCarousel: React.FC<Props> = ({ reviews }) => {
  return (
    <Swiper
      spaceBetween={12}
      slidesPerView={'auto'}
      centeredSlides={true}
      className="w-full"
    >
      {reviews.map((item, idx) => {
        const highlights = item.content.includes(HIGHLIGHT_KEYWORD)
          ? [HIGHLIGHT_KEYWORD]
          : [];
        const meta = `${item.name} / ${item.programName} / ${item.passedState}`;
        return (
          <SwiperSlide key={idx} className="mx-auto !w-[300px] md:!w-[371px]">
            <TestimonialCard
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
