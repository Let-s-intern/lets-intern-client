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

const TestimonialCard = ({
  title,
  content,
  meta,
}: {
  title: string;
  content: string;
  meta: string;
}) => {
  return (
    <div className="rounded-xs bg-static-100 min-h-[282px] w-[300px] p-5 shadow-sm md:w-[371px] md:rounded-sm">
      <div className="rounded-xs mb-3 flex w-fit items-center bg-[#FEEEE5] px-2 py-1.5">
        {[...Array(5)].map((_, idx) => (
          <Image
            key={idx}
            src="/images/hr-star.svg"
            alt="star"
            width={16}
            height={16}
          />
        ))}
      </div>
      <div className="text-neutral-0 min-h-[210px]">
        <p className="text-xsmall16 md:text-small20 mb-2 line-clamp-1 break-keep font-bold">
          {title}
        </p>
        <p className="md:line-clamp-7 text-xsmall14 md:text-xsmall16 line-clamp-6 whitespace-pre-line font-medium leading-relaxed">
          {content}
        </p>
      </div>
      <div className="text-xsmall14 mt-4 font-normal text-neutral-50">
        {meta}
      </div>
    </div>
  );
};

const TestimonialCarousel: React.FC<Props> = ({ reviews }) => {
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <div className="w-full">
      <Swiper
        spaceBetween={12}
        slidesPerView="auto"
        centeredSlides={isMobile ? true : false}
        freeMode={false}
        initialSlide={0}
        mousewheel={true}
        scrollbar={true}
        slidesOffsetAfter={isMobile ? 0 : 220}
        slidesOffsetBefore={isMobile ? 0 : 220}
        modules={[FreeMode, Scrollbar, Mousewheel]}
        className="w-full"
      >
        {reviews.map((item, idx) => {
          const meta = `${maskingName(item.name)} / ${item.passedState}`;

          return (
            <SwiperSlide key={idx} className="!w-[300px] md:!w-[371px]">
              <TestimonialCard
                title={item.title}
                content={item.content}
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
