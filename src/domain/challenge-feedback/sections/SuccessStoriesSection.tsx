'use client';

import { memo } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SUCCESS_STORIES } from '../data/challenge-feedback-data';

const CARD_COLORS = [
  'bg-purple-50',
  'bg-green-50',
  'bg-pink-50',
  'bg-blue-50',
  'bg-amber-50',
  'bg-cyan-50',
  'bg-rose-50',
  'bg-indigo-50',
];

const SuccessStoriesSection = memo(function SuccessStoriesSection() {
  return (
    <section className="w-full overflow-hidden bg-[#0C0A1D] py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-10 text-center text-xl font-bold text-[#B49AFF] md:text-2xl">
          렛츠커리어와 함께 취뽀한 주인공들을 소개합니다
        </h2>
      </div>

      <Swiper
        className="slide-per-auto slide-rolling"
        modules={[Autoplay]}
        allowTouchMove={false}
        loop
        spaceBetween={16}
        slidesPerView="auto"
        autoplay={{ delay: 1 }}
        speed={4000}
      >
        {SUCCESS_STORIES.map((story, i) => (
          <SwiperSlide
            key={`story-${i}`}
            className="!w-[200px] md:!w-[240px]"
          >
            <div
              className={`flex flex-col rounded-lg p-5 ${CARD_COLORS[i % CARD_COLORS.length]}`}
            >
              <p className="text-base font-bold text-gray-900">
                {story.company}
              </p>
              <p className="mt-1 text-sm text-gray-600">{story.role}</p>
              <p className="mt-3 text-xs text-gray-500">
                {story.name} {story.year} 합격
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
});

export default SuccessStoriesSection;
