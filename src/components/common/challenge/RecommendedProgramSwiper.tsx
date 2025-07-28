import { ProgramRecommend } from '@/types/interface';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

const TEXT_SHADOW_STYLE = {
  textShadow: '0 0 8.4px rgba(33, 33, 37, 0.40)',
};

interface Props {
  programs: ProgramRecommend['list'];
}

function RecommendedProgramSwiper({ programs }: Props) {
  return (
    <div className="mx-auto w-full max-w-[1120px]">
      <Swiper
        spaceBetween={12}
        slidesOffsetBefore={20}
        slidesOffsetAfter={20}
        slidesPerView="auto"
        breakpoints={{
          768: {
            slidesPerView: 5,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
          },
        }}
        className="operation-recommend-swiper"
      >
        {programs.map((item) => {
          const info = item.programInfo;
          return (
            <SwiperSlide key={info.id} className="!w-[214px]">
              <div className="flex flex-col gap-2">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-100">
                  <img
                    src={info.thumbnail || undefined}
                    className="h-full w-full object-cover"
                    alt={info.title || '추천 프로그램 썸네일'}
                  />
                  <div className="absolute inset-x-0 top-0 h-2/3 w-full bg-gradient-to-b from-[#161E31]/40 to-[#161E31]/0 p-3">
                    <span
                      className="block w-fit text-xsmall14 font-semibold text-white"
                      style={TEXT_SHADOW_STYLE}
                    >
                      {item.recommendTitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to={`/program/${info.id}`}
                    className="font-medium text-neutral-0"
                  >
                    {item.recommendCTA || '자세히 보기'}
                  </Link>
                  <ChevronRight size={20} color="#CFCFCF" />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default RecommendedProgramSwiper;
