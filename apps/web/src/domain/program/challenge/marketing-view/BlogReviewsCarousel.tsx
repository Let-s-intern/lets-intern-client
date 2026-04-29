'use client';

import { useMediaQuery } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import 'swiper/css';
import { FreeMode, Mousewheel, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface BlogReview {
  writer: string;
  image: string;
  url: string;
}

interface Props {
  reviews: BlogReview[];
}

const BlogReviewCard = ({ writer, image, url }: BlogReview) => (
  <div className="flex w-full flex-col gap-3 overflow-hidden rounded-md bg-white px-[22px] py-5">
    <button
      type="button"
      onClick={() => window.open(url, '_blank')}
      className="group relative aspect-[327/208] w-full overflow-hidden"
    >
      <Image
        src={image}
        alt={writer}
        fill
        className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
      />
    </button>
    <span className="text-xsmall14 text-neutral-30 line-clamp-1 w-full text-start font-normal tracking-[-0.02px]">
      {writer}
    </span>
  </div>
);

const BlogReviewsCarousel: React.FC<Props> = ({ reviews }) => {
  const isMobile = useMediaQuery('(max-width:768px)');

  if (!isMobile) {
    return (
      <div className="flex w-full max-w-[1137px] gap-3 px-5">
        {reviews.map((review, idx) => (
          <div key={idx} className="flex-1">
            <BlogReviewCard {...review} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
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
        {reviews.map((review, idx) => (
          <SwiperSlide key={idx} className="!w-[300px]">
            <BlogReviewCard {...review} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogReviewsCarousel;
