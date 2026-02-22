'use client';

import { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useGetCommonBannerListForUser } from '@/api/banner';
import HybridLink from '@/common/HybridLink';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';
import { useMediaQuery } from '@mui/material';

interface MyPageBannerProps {
  className?: string;
}

const BANNER_AUTOPLAY_DELAY_MS = 2500;

const MyPageBanner = ({ className }: MyPageBannerProps) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const { data: bannerList = [], isLoading } = useGetCommonBannerListForUser({
    type: 'MY_PAGE',
  });
  const [isPlay, setIsPlay] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(1);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleTogglePlay = () => {
    if (!swiperRef.current) return;

    if (isPlay) {
      swiperRef.current.autoplay.stop();
    } else {
      swiperRef.current.autoplay.start();
    }
    setIsPlay(!isPlay);
  };

  if (isLoading || bannerList.length === 0) return null;

  const hasMultipleSlides = bannerList.length > 1;

  return (
    <section className={`relative ${className}`}>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setCurrentIndex(swiper.realIndex + 1);
        }}
        autoplay={
          hasMultipleSlides ? { delay: BANNER_AUTOPLAY_DELAY_MS } : false
        }
        modules={[Pagination, Autoplay, Navigation]}
        loop={hasMultipleSlides}
        navigation={hasMultipleSlides}
        slidesPerView={1}
        className="mypage-banner-swiper aspect-[3.2/1] h-full w-full"
      >
        {bannerList.map((banner, index) => (
          <SwiperSlide key={index}>
            <HybridLink
              href={banner.landingUrl || '#'}
              className="mypage_banner select-none"
              data-url={banner.landingUrl}
              target={
                banner.landingUrl?.includes('letscareer.co.kr') ||
                banner.landingUrl?.includes(
                  'lets-intern-client-test.vercel.app',
                )
                  ? '_self'
                  : '_blank'
              }
              rel="noreferrer"
            >
              <img
                src={isMobile ? banner.mobileImgUrl || '' : banner.imgUrl || ''}
                alt={'mypage-banner-' + index}
                className="h-full w-full object-cover"
              />
            </HybridLink>
          </SwiperSlide>
        ))}
      </Swiper>
      {hasMultipleSlides && (
        <div className="absolute bottom-4 left-5 z-10 flex items-center gap-1.5">
          <img
            onClick={handleTogglePlay}
            className="h-5 w-5 cursor-pointer"
            src="/icons/play.svg"
            alt="배너 페이지네이션 재생 아이콘"
          />
          <span className="text-0.75-medium md:text-0.875-medium text-white">
            {String(currentIndex).padStart(2, '0')} /{' '}
            {String(bannerList.length).padStart(2, '0')}
          </span>
        </div>
      )}
    </section>
  );
};

export default MyPageBanner;
