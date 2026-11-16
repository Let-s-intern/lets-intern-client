'use client';

import StarIcon from '@/assets/icons/star.svg';
import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { FreeMode, Mousewheel, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProgramDetailReviewItem, {
  maskingName,
} from '../../program-detail/review/ProgramDetailReviewItem';

interface ReviewItem {
  name: string;
  programName: string;
  passedState: string;
  title: string;
  content: string;
  score?: number;
  npsScore?: number;
}

interface Props {
  reviews: ReviewItem[];
  starBadgeBgColor: string;
  starColor: string;
}

const TestimonialCard = ({
  title,
  content,
  meta,
  starBadgeBgColor,
  starColor,
}: {
  title: string;
  content: string;
  meta: string;
  starBadgeBgColor: string;
  starColor: string;
}) => {
  return (
    <div className="min-h-[282px] w-[300px] rounded-xs bg-static-100 p-5 shadow-sm md:w-[371px] md:rounded-sm">
      <div
        className="mb-3 flex w-fit items-center rounded-xs px-2 py-1.5"
        style={{ backgroundColor: starBadgeBgColor }}
      >
        {[...Array(5)].map((_, idx) => (
          <StarIcon
            key={idx}
            className="h-4 w-4"
            style={{ color: starColor }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="min-h-[210px] text-neutral-0">
        <p className="mb-2 line-clamp-1 break-keep text-xsmall16 font-bold md:text-small20">
          {title}
        </p>
        <p className="md:line-clamp-7 line-clamp-6 whitespace-pre-line text-xsmall14 font-medium leading-relaxed md:text-xsmall16">
          {content}
        </p>
      </div>
      <div className="mt-4 text-xsmall14 font-normal text-neutral-50">
        {meta}
      </div>
    </div>
  );
};

const TestimonialCarousel: React.FC<Props> = ({
  reviews,
  starBadgeBgColor,
  starColor,
}) => {
  const displayedReviews = reviews.slice(0, 3);

  return (
    <>
      {/* 모바일: Swiper */}
      <div className="px-5 md:hidden">
        <Swiper
          spaceBetween={12}
          slidesPerView="auto"
          centeredSlides={true}
          freeMode={false}
          initialSlide={0}
          mousewheel={true}
          scrollbar={true}
          modules={[FreeMode, Scrollbar, Mousewheel]}
          className="w-full"
        >
          {displayedReviews.map((item, idx) => {
            const hasScore =
              typeof item.score === 'number' &&
              typeof item.npsScore === 'number';
            const meta = `${maskingName(item.name)} / ${item.passedState}`;
            return (
              <SwiperSlide key={idx} className="!w-[300px]">
                {hasScore ? (
                  <ProgramDetailReviewItem
                    type="challenge"
                    review={item}
                    color={starColor}
                    bgColor={starBadgeBgColor}
                  />
                ) : (
                  <TestimonialCard
                    title={item.title}
                    content={item.content}
                    meta={meta}
                    starBadgeBgColor={starBadgeBgColor}
                    starColor={starColor}
                  />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      {/* 데스크탑: 3개 고정 */}
      <div className="mx-auto hidden w-full max-w-[1160px] gap-3 px-[60px] md:flex lg:px-0">
        {displayedReviews.map((item, idx) => {
          const hasScore =
            typeof item.score === 'number' && typeof item.npsScore === 'number';
          const meta = `${maskingName(item.name)} / ${item.passedState}`;
          return hasScore ? (
            <ProgramDetailReviewItem
              key={idx}
              type="challenge"
              review={item}
              color={starColor}
              bgColor={starBadgeBgColor}
            />
          ) : (
            <TestimonialCard
              key={idx}
              title={item.title}
              content={item.content}
              meta={meta}
              starBadgeBgColor={starBadgeBgColor}
              starColor={starColor}
            />
          );
        })}
      </div>
    </>
  );
};

export default TestimonialCarousel;
