'use client';

import { useMentorChallengeListQuery } from '@/api/user/user';
import MentorChallengeCard from './MentorChallengeCard';

const ChallengeListPage = () => {
  const { data, isLoading } = useMentorChallengeListQuery();
  const challenges = data?.myChallengeMentorVoList ?? [];

  return (
    <div className="flex-1 p-8">
      <h1 className="mb-6 text-xl font-bold text-gray-900">
        참여중인 챌린지
      </h1>

      {isLoading ? (
        <div className="py-12 text-center text-gray-400">로딩 중...</div>
      ) : challenges.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          참여 중인 챌린지가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <MentorChallengeCard
              key={challenge.challengeId}
              challengeId={challenge.challengeId}
              title={challenge.title}
              shortDesc={challenge.shortDesc}
              thumbnail={challenge.thumbnail}
              startDate={challenge.startDate}
              endDate={challenge.endDate}
              programStatusType={challenge.programStatusType}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeListPage;
