import { useMentorChallengeListQuery, useUserQuery } from '@/api/user';
import FeedbackCard from '@/components/common/mypage/ui/card/FeedbackCard';
import useAuthStore from '@/store/useAuthStore';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const Feedback = () => {
  const { isLoggedIn } = useAuthStore();
  const { data: user } = useUserQuery({ enabled: isLoggedIn, retry: 1 });
  const { data: mentorChallengeData, isLoading } =
    useMentorChallengeListQuery();
  const challengeList = mentorChallengeData?.myChallengeMentorVoList || [];

  if (!user) return null;

  return (
    <section className="flex flex-col gap-6 pl-5">
      <h2 className="text-small18 font-bold">참여 중</h2>

      {isLoading ? (
        <div className="text-neutral-500">로딩 중...</div>
      ) : challengeList.length > 0 ? (
        <>
          {/* 모바일 스와이퍼 뷰 */}
          <div className="w-[90vw] overflow-hidden md:hidden">
            <Swiper
              modules={[FreeMode]}
              slidesPerView="auto"
              spaceBetween={16}
              freeMode={true}
              grabCursor={true}
              touchRatio={1}
              threshold={10}
              className="!overflow-visible pb-2"
            >
              {challengeList.map((challenge) => (
                <SwiperSlide key={challenge.challengeId} className="!w-[280px]">
                  <FeedbackCard challenge={challenge} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 데스크톱 세로 나열 뷰 */}
          <div className="hidden md:flex md:flex-col md:gap-4">
            {challengeList.map((challenge) => (
              <FeedbackCard key={challenge.challengeId} challenge={challenge} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-neutral-500">참여 중인 챌린지가 없습니다.</div>
      )}
    </section>
  );
};

export default Feedback;
