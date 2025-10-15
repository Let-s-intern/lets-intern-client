import { useGetChallengeTitle } from '@/api/challenge';
import useGoogleAnalytics from '@/hooks/useGoogleAnalytics';
import { ProgramRecommend } from '@/types/interface';
import { ChevronRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import HybridLink from '../../../ui/HybridLink';

const TEXT_SHADOW_STYLE = {
  textShadow: '0 0 8.4px rgba(33, 33, 37, 0.40)',
};

interface Props {
  programs: ProgramRecommend['list'];
}

function RecommendedProgramSwiper({ programs }: Props) {
  const params = useParams<{ programId: string }>();
  const router = useRouter();
  const programId = params.programId;

  const trackEvent = useGoogleAnalytics();

  const { data: challengeTitleData } = useGetChallengeTitle(programId);

  const handleClickSlide = (
    clickProgramUrl: string,
    clickProgramName: string | null,
  ) => {
    trackEvent({
      eventName: 'dashboard_programrec',
      eventData: {
        click_program_url: clickProgramUrl,
        click_program_name: clickProgramName,
        current_dashboard_challenge_name: challengeTitleData?.title,
      },
    });
    router.push(clickProgramUrl);
  };

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
          const url = `/program/${info.programType.toLocaleLowerCase()}/${info.id}/${encodeURIComponent(info.title ?? '')}`;

          return (
            <SwiperSlide
              key={info.id}
              className="dashboard_programrec !w-[214px] cursor-pointer"
              onClick={() => handleClickSlide(url, info.title ?? null)}
            >
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

                <HybridLink href={url} className="flex justify-between">
                  <span className="font-medium text-neutral-0">
                    {item.recommendCTA || '자세히 보기'}
                  </span>
                  <ChevronRight className="mt-0.5" size={20} color="#CFCFCF" />
                </HybridLink>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default RecommendedProgramSwiper;
