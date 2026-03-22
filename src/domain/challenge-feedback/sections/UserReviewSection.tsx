'use client';

import { memo, useRef } from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

import './user-review-pagination.css';
import ReviewCard from '../components/ReviewCard';
import { USER_REVIEWS } from '../data/challenge-feedback-data';

const UserReviewSection = memo(function UserReviewSection() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#131030] py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1100px] px-6">
        {/* Section Header */}
        <p className="text-center text-sm font-semibold text-[#B49AFF] md:text-base">
          피드백 후기
        </p>
        <h2 className="mt-2 text-center text-lg font-bold text-white md:text-2xl">
          렛츠커리어 수강생의 솔직한 피드백 후기
        </h2>
        <p className="mt-4 text-center text-sm text-gray-300 md:text-lg">
          이미 피드백을 경험한 수강생분들의
          <br className="md:hidden" />
          솔직한 후기를 확인해보세요!
        </p>

        {/* Swiper Carousel */}
        <div className="mt-10 md:mt-14">
          <Swiper
            modules={[Pagination]}
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
          <div className="mt-8 flex items-center justify-center gap-2 md:gap-3">
            <button
              type="button"
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-gray-400 transition-colors hover:bg-white/10 md:h-14 md:w-14"
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

            <div className="user-review-pagination flex items-center justify-center gap-2.5" />

            <button
              type="button"
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-gray-400 transition-colors hover:bg-white/10 md:h-14 md:w-14"
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
