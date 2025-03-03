import { useGetBannerListForUser } from '@/api/banner';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { useMediaQuery } from '@mui/material';
import { MouseEvent } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const MainBannerSection = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { data, isLoading } = useGetBannerListForUser({ type: 'MAIN' });

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
      <section className="mt-16 w-full max-w-[1120px] px-5 md:mt-22.5 xl:px-0">
        {isLoading ? (
          <LoadingContainer />
        ) : !data || !data.bannerList || data.bannerList.length === 0 ? null : (
          <div className="w-full">
            <Swiper
              autoplay={data.bannerList.length > 1 ? { delay: 2500 } : false}
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
              className="h-[6.25rem] rounded-sm md:h-[11.25rem]"
            >
              {data.bannerList.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <a
                    href={banner.link || '#'}
                    className="top_banner select-none"
                    data-url={banner.link}
                    target={
                      banner.link?.includes('letscareer.co.kr') ||
                      banner.link?.includes(
                        'lets-intern-client-test.vercel.app',
                      )
                        ? '_self'
                        : '_blank'
                    }
                    rel="noreferrer"
                    onClick={handleClickBanner}
                  >
                    <img
                      src={
                        isMobile
                          ? banner.mobileImgUrl || ''
                          : banner.imgUrl || ''
                      }
                      alt={'main-banner' + banner.id}
                      className="h-full w-full rounded-sm object-cover"
                    />
                  </a>
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
