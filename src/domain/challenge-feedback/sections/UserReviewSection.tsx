'use client';

import { memo, useRef } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ReviewCard from '../components/ReviewCard';
import { USER_REVIEWS } from '../data/challenge-feedback-data';

const UserReviewSection = memo(function UserReviewSection() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="flex w-full flex-col items-center justify-center bg-neutral-50 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1100px] px-6">
        {/* Section Header */}
        <p className="text-center text-sm font-semibold text-primary md:text-base">
          수강 후기
        </p>
        <h2 className="mt-2 text-center text-xl font-bold text-neutral-900 md:text-2xl">
          수료생들의 솔직한 후기 모음
        </h2>

        {/* Swiper Carousel */}
        <div className="mt-10 md:mt-14">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            loop
            pagination={{
              clickable: true,
              el: '.user-review-pagination',
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            breakpoints={{
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="pb-4"
          >
            {USER_REVIEWS.map((review, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation + Pagination */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-500 transition-colors hover:bg-neutral-100"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="user-review-pagination flex items-center gap-1.5" />

            <button
              type="button"
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-500 transition-colors hover:bg-neutral-100"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default UserReviewSection;
