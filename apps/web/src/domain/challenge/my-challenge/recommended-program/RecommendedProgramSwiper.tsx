import { useGetChallengeTitle } from '@/api/challenge/challenge';
import useGoogleAnalytics from '@/hooks/useGoogleAnalytics';
import { ChallengeHome } from '@/schema';
import { ChevronRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

const TEXT_SHADOW_STYLE = {
  textShadow: '0 0 8.4px rgba(33, 33, 37, 0.40)',
};

type Program = ChallengeHome['programRecommendList'][0]['programs'][0];

interface Props {
  programs: Program[];
}

function RecommendedProgramSwiper({ programs }: Props) {
  const params = useParams<{ programId: string }>();
  const router = useRouter();
  const trackEvent = useGoogleAnalytics();
  const { data: challengeTitleData } = useGetChallengeTitle(params.programId);

  const handleClickSlide = (program: Program) => {
    const url = `/program/${program.programType.toLowerCase()}/${program.programId}`;
    trackEvent({
      eventName: 'dashboard_programrec',
      eventData: {
        click_program_url: url,
        click_program_name: program.title,
        current_dashboard_challenge_name: challengeTitleData?.title,
      },
    });
    router.push(url);
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
        {programs.map((program) => (
          <SwiperSlide
            key={`${program.programId}-${program.programType}`}
            className="dashboard_programrec !w-[214px] cursor-pointer"
            onClick={() => handleClickSlide(program)}
          >
            <div className="flex flex-col gap-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-100">
                <img
                  src={program.thumbnail || undefined}
                  className="h-full w-full object-cover"
                  alt={program.title}
                />
                <div className="absolute inset-x-0 top-0 h-2/3 w-full bg-gradient-to-b from-[#161E31]/40 to-[#161E31]/0 p-3">
                  <span
                    className="text-xsmall14 block w-fit font-semibold text-white"
                    style={TEXT_SHADOW_STYLE}
                  >
                    {program.title}
                  </span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-0 font-medium">
                  {program.cta || '자세히 보기'}
                </span>
                <ChevronRight className="mt-0.5" size={20} color="#CFCFCF" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default RecommendedProgramSwiper;
