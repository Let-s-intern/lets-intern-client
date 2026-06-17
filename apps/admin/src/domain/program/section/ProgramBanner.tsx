import { useGetUserProgramBannerListQuery } from '@/api/program';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';
import { useMediaQuery } from '@mui/material';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const ProgramBanner = () => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const { data, isLoading } = useGetUserProgramBannerListQuery();

  if (isLoading || !data || data.bannerList.length === 0) return null;

  return (
    <section className="w-full">
      <Swiper
        autoplay={data.bannerList.length > 1 ? { delay: 5000 } : false}
        modules={[Pagination, Autoplay, Navigation]}
        loop={data.bannerList.length > 1}
        navigation={data.bannerList.length > 1}
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
        className="aspect-[3.2/1] overflow-hidden rounded-sm md:aspect-[6.4/1]"
      >
        {data.bannerList.map((banner) => (
          <SwiperSlide key={banner.id}>
            <a
              href={banner.link || '#'}
              className="program_banner select-none"
              target={
                banner.link?.includes(window.location.origin)
                  ? '_self'
                  : '_blank'
              }
              rel="noreferrer"
            >
              <img
                src={isMobile ? banner.mobileImgUrl : banner.imgUrl}
                alt="프로그램 배너"
                className="h-full w-full rounded-sm object-cover object-center"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ProgramBanner;
