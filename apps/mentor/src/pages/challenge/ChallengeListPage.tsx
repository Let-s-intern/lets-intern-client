'use client';

import { useMemo } from 'react';
import {
  useMentorChallengeListQuery,
  type ChallengeMentorVo,
} from '@/api/user/user';
import MentorChallengeCard from './ui/MentorChallengeCard';

function ChallengeGrid({ challenges }: { challenges: ChallengeMentorVo[] }) {
  return (
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
  );
}

function EmptyMessage({ children }: { children: React.ReactNode }) {
  return <div className="py-12 text-center text-gray-400">{children}</div>;
}

const ChallengeListPage = () => {
  const { data, isLoading } = useMentorChallengeListQuery();
  const challenges = data?.myChallengeMentorVoList ?? [];

  const { activeChallenges, endedChallenges } = useMemo(() => {
    const active: ChallengeMentorVo[] = [];
    const ended: ChallengeMentorVo[] = [];
    const now = new Date();

    for (const c of challenges) {
      const isEnded =
        c.programStatusType === 'POST' || new Date(c.endDate) < now;
      if (isEnded) {
        ended.push(c);
      } else {
        active.push(c);
      }
    }

    return { activeChallenges: active, endedChallenges: ended };
  }, [challenges]);

  if (isLoading) {
    return (
      <div className="flex-1">
        <h1 className="mb-6 text-xl font-bold text-gray-900">
          참여중인 챌린지
        </h1>
        <EmptyMessage>로딩 중...</EmptyMessage>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* 참여중인 챌린지 */}
      <section>
        <h1 className="mb-6 text-xl font-bold text-gray-900">
          참여중인 챌린지
        </h1>
        {activeChallenges.length === 0 ? (
          <EmptyMessage>참여 중인 챌린지가 없습니다.</EmptyMessage>
        ) : (
          <ChallengeGrid challenges={activeChallenges} />
        )}
      </section>

      {/* 끝난 챌린지 */}
      {endedChallenges.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-bold text-gray-900">끝난 챌린지</h2>
          <ChallengeGrid challenges={endedChallenges} />
        </section>
      )}
    </div>
  );
};

export default ChallengeListPage;
