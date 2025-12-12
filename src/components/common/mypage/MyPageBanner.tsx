'use client';

import { useMemo, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useGetBannerListForUser } from '@/api/banner';

interface MyPageBannerProps {
  className?: string;
}

const MyPageBanner = ({ className }: MyPageBannerProps) => {
  const { data, isLoading } = useGetBannerListForUser({ type: 'MAIN' });
  const [isPlay, setIsPlay] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(1);
  const swiperRef = useRef<SwiperType | null>(null);

  // mobileImgUrl이 있는 배너만 필터링
  const bannerList = useMemo(() => {
    if (!data?.bannerList) return [];
    return data.bannerList.filter((banner) => banner.mobileImgUrl);
  }, [data]);

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
        autoplay={hasMultipleSlides ? { delay: 2500 } : false}
        modules={[Pagination, Autoplay, Navigation]}
        loop={hasMultipleSlides}
        navigation={hasMultipleSlides}
        slidesPerView={1}
        className="mypage-banner-swiper aspect-[3.2/1] h-full w-full"
      >
        {bannerList.map((banner) => (
          <SwiperSlide key={banner.id}>
            <a
              href={banner.link || '#'}
              className="mypage_banner select-none"
              data-url={banner.link}
              target={
                banner.link?.includes('letscareer.co.kr') ||
                banner.link?.includes('lets-intern-client-test.vercel.app')
                  ? '_self'
                  : '_blank'
              }
              rel="noreferrer"
            >
              <img
                src={banner.mobileImgUrl || ''}
                alt={'mypage-banner' + banner.id}
                className="h-full w-full object-cover"
              />
            </a>
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
