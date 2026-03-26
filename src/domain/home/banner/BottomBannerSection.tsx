'use client';

import { useGetCommonBannerListForUser } from '@/api/banner';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';
import { useMediaQuery } from '@mui/material';
import { MouseEvent } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const BottomBannerSection = () => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const { data: bannerList, isLoading } = useGetCommonBannerListForUser({ type: 'HOME_BOTTOM' });

  const handleClickBanner = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('.swiper-button-prev') ||
      target.closest('.swiper-button-next')
    ) {
      e.preventDefault(); // a태그 이동 방지
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="mt-16 w-full max-w-[1120px] px-5 md:mt-22.5 xl:px-0">
          <LoadingContainer />
        </div>
      ) : !bannerList || bannerList.length === 0 ? null : (
        <section className="mt-16 w-full max-w-[1120px] px-5 md:mt-22.5 xl:px-0">
          <Swiper
            autoplay={bannerList.length > 1 ? { delay: 2500 } : false}
            modules={[Pagination, Autoplay, Navigation]}
            loop={bannerList.length > 1}
            navigation={bannerList.length > 1}
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
            className="aspect-[3.2/1] rounded-sm md:aspect-[6.4/1]"
          >
            {bannerList.map((banner, index) => (
              <SwiperSlide key={index}>
                <a
                  href={banner.landingUrl || '#'}
                  target={
                    banner.landingUrl?.includes('letscareer.co.kr') ||
                    banner.landingUrl?.includes('lets-intern-client-test.vercel.app')
                      ? '_self'
                      : '_blank'
                  }
                  rel="noreferrer"
                  data-url={banner.landingUrl}
                  className="bottom_banner select-none"
                  onClick={handleClickBanner}
                >
                  <img
                    src={
                      isMobile ? banner.mobileImgUrl || '' : banner.imgUrl || ''
                    }
                    alt={'main-banner-' + index}
                    className="h-full w-full rounded-sm object-cover"
                  />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}
    </>
  );
};

export default BottomBannerSection;
