'use client';

import type { BlogReviewCard } from './utils/blogReviewUtils';
import { useMediaQuery } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import 'swiper/css';
import { FreeMode, Mousewheel, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const BlogReviewCard = ({
  thumbnail,
  label,
  href,
  isExternal,
}: BlogReviewCard) => {
  const imageBlock = (
    <div className="group relative aspect-[327/208] w-full overflow-hidden">
      <img
        src={thumbnail}
        alt={label}
        className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
      />
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-3 overflow-hidden rounded-md bg-white px-[22px] py-5">
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {imageBlock}
        </a>
      ) : (
        <Link href={href} target="_blank">
          {imageBlock}
        </Link>
      )}
      <span className="text-xsmall14 text-neutral-30 line-clamp-1 w-full text-start font-normal tracking-[-0.02px]">
        {label}
      </span>
    </div>
  );
};

const BlogReviewsCarousel: React.FC<{ reviews: BlogReviewCard[] }> = ({
  reviews,
}) => {
  const isMobile = useMediaQuery('(max-width:768px)');

  if (!isMobile) {
    return (
      <div className="flex w-full max-w-[1137px] gap-3 px-5">
        {reviews.map(({ key, ...rest }) => (
          <div key={key} className="flex-1">
            <BlogReviewCard {...rest} />
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
        {reviews.map(({ key, ...rest }) => (
          <SwiperSlide key={key} className="!w-[300px]">
            <BlogReviewCard {...rest} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogReviewsCarousel;
