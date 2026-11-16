import clsx from 'clsx';
import { memo } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import {
  LOGO_IMG,
  SUCCESS_STORIES,
  type SuccessStoryItem,
} from '../data/success-stories';

const LogoPlayItem = ({
  theme,
  img,
  company,
  job,
  name,
  pass,
}: SuccessStoryItem) => (
  <div
    className={clsx(
      'flex w-[218px] select-none justify-between rounded-sm p-3 pb-4 md:w-80 md:p-5 md:pb-6',
    )}
    style={{ backgroundColor: theme }}
  >
    <div className="flex flex-col text-neutral-0">
      <span className="text-xsmall14 font-semibold md:text-medium22">
        {company}
      </span>
      <span className="mt-3 text-xsmall16 font-medium md:mt-6 md:text-small20">
        {job}
      </span>
      <span className="mt-1 text-xsmall14 font-medium md:text-xsmall16">
        <span>{name}</span>
        <span className="ml-3">{pass} 합격</span>
      </span>
    </div>
    <img
      src={LOGO_IMG[img]}
      className="h-[50px] w-[50px] overflow-hidden rounded-sm object-cover md:h-[72px] md:w-[72px]"
      alt={company}
    />
  </div>
);

const SuccessStoriesSection = memo(function SuccessStoriesSection() {
  return (
    <section className="flex w-full flex-col items-center justify-center overflow-hidden bg-[#0e0c22] py-20 pb-40 md:py-28 md:pb-48">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-10 text-center text-lg font-bold text-white md:mb-14 md:text-2xl">
          렛츠커리어와 함께{' '}
          <span className="text-[#B49AFF]">취뽀한 주인공들</span>을 소개합니다
        </h2>
      </div>

      <Swiper
        className="slide-per-auto slide-rolling w-full"
        modules={[Autoplay]}
        allowTouchMove={false}
        loop
        spaceBetween={12}
        slidesPerView="auto"
        autoplay={{ delay: 1 }}
        speed={5000}
        breakpoints={{
          768: {
            spaceBetween: 20,
          },
        }}
      >
        {SUCCESS_STORIES.map((story, index) => (
          <SwiperSlide key={`story-${index}`}>
            <LogoPlayItem {...story} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
});

export default SuccessStoriesSection;
