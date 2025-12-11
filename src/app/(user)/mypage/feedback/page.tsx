'use client';

import { useMentorChallengeListQuery, useUserQuery } from '@/api/user';
import MobileCarousel from '@/common/ui/carousel/MobileCarousel';
import FeedbackCard from '@/domain/mypage/ui/card/FeedbackCard';
import useAuthStore from '@/store/useAuthStore';

interface Challenge {
  challengeId: number;
  title: string;
  shortDesc: string;
  thumbnail?: string;
  startDate: string;
  endDate: string;
}

const Feedback = () => {
  const { isLoggedIn } = useAuthStore();
  const { data: user } = useUserQuery({ enabled: isLoggedIn, retry: 1 });
  const { data: mentorChallengeData, isLoading } =
    useMentorChallengeListQuery();
  const challengeList = mentorChallengeData?.myChallengeMentorVoList || [];

  if (!user) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-small18 font-bold">참여 중</h2>

      {isLoading ? (
        <div className="text-neutral-500">로딩 중...</div>
      ) : challengeList.length > 0 ? (
        <MobileCarousel<Challenge>
          items={challengeList}
          renderItem={(challenge) => <FeedbackCard challenge={challenge} />}
          itemWidth="169px"
          spaceBetween={16}
          containerWidth="93vw"
          getItemKey={(challenge) => challenge.challengeId}
        />
      ) : (
        <div className="text-neutral-500">참여 중인 챌린지가 없습니다.</div>
      )}
    </section>
  );
};

export default Feedback;
