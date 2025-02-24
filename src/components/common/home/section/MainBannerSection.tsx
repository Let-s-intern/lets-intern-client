import { useGetBannerListForUser } from '@/api/banner';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { useMediaQuery } from '@mui/material';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const MainBannerSection = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { data, isLoading } = useGetBannerListForUser({ type: 'MAIN' });

  return (
    <>
      <section className="mt-16 w-full max-w-[1160px] px-5 md:mt-24 md:px-0">
        {isLoading ? (
          <LoadingContainer />
        ) : !data || !data.bannerList || data.bannerList.length === 0 ? null : (
          <div className="w-full">
            <Swiper
              autoplay={{ delay: 2500 }}
              modules={[Pagination, Autoplay]}
              pagination={{
                type: 'fraction',
                renderFraction: (currentClass, totalClass) =>
                  `<div class="flex items-center justify-end px-2">
                  <div class="flex w-fit items-center justify-center bg-white/20 px-2 py-0.5 rounded-full text-xxsmall10 text-white">
                  <span class="${currentClass}"></span> / <span class="${totalClass}"></span>
                  </div>
                </div>`,
              }}
              slidesPerView={1}
              className="h-[6.25rem] rounded-sm md:h-[11.25rem]"
            >
              {data.bannerList.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <img
                    src={
                      isMobile ? banner.mobileImgUrl || '' : banner.imgUrl || ''
                    }
                    alt={'main-banner' + banner.id}
                    className="h-full w-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </section>
    </>
  );
};

export default MainBannerSection;
