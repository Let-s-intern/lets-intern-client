'use client';

import { MouseEvent, useMemo } from 'react';
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

  // mobileImgUrl이 있는 배너만 필터링
  const bannerList = useMemo(() => {
    if (!data?.bannerList) return [];
    return data.bannerList.filter((banner) => banner.mobileImgUrl);
  }, [data]);

  const handleClickBanner = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('.swiper-button-prev') ||
      target.closest('.swiper-button-next')
    ) {
      e.preventDefault();
    }
  };

  if (isLoading || bannerList.length === 0) return null;

  const hasMultipleSlides = bannerList.length > 1;

  return (
    <section className={className}>
      <Swiper
        autoplay={hasMultipleSlides ? { delay: 2500 } : false}
        modules={[Pagination, Autoplay, Navigation]}
        loop={hasMultipleSlides}
        navigation={hasMultipleSlides}
        pagination={{
          type: 'fraction',
          renderFraction: (currentClass, totalClass) =>
            `<div class="flex items-center justify-end px-2">
              <div class="flex w-fit items-center justify-center bg-white/20 px-2 py-0.5 rounded-full text-xxsmall10 md:text-xxsmall12 text-white">
              <span class="${currentClass}"></span> / <span class="${totalClass}"></span>
              </div>
            </div>`,
        }}
        slidesPerView={1}
        className="aspect-[3.2/1] h-full w-full"
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
              onClick={handleClickBanner}
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
    </section>
  );
};

export default MyPageBanner;
