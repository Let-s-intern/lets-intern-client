'use client';

import { useLiveFeedbackListQuery } from '@/api/feedback/feedback';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import LiveFeedbackSection from '@/domain/challenge/feedback/live/section/LiveFeedbackSection';
import { toMission } from '@/domain/challenge/feedback/live/utils';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { LiveFeedbackMission } from './types';

const LiveFeedbackPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { programId } = useParams<{ programId: string }>();
  const { currentChallenge } = useCurrentChallenge();

  const { data } = useLiveFeedbackListQuery(programId);

  const missions = useMemo(
    () =>
      (data?.liveFeedbackList ?? []).map((item, index) =>
        toMission(item, index, currentChallenge?.challengeType ?? ''),
      ),
    [data, currentChallenge?.challengeType],
  );

  const handleMobileClick = useCallback(
    (mission: LiveFeedbackMission) => {
      router.push(`${pathname}/${mission.id}`);
    },
    [pathname, router],
  );

  const needReservation = missions.filter((m) => m.status === 'prev');
  const reserved = missions.filter((m) => m.status === 'reserved');
  const done = missions.filter((m) => m.status === 'done');
  const expired = missions.filter((m) => m.status === 'expired');

  return (
    <div className="flex flex-col gap-10">
      <LiveFeedbackSection
        label="예약 필요"
        missions={needReservation}
        emptyMessage="예약 필요한 미션이 없어요."
        onMobileClick={handleMobileClick}
      />
      <LiveFeedbackSection
        label="예약 완료"
        missions={reserved}
        emptyMessage="예약 완료된 미션이 없어요."
        onMobileClick={handleMobileClick}
      />
      <LiveFeedbackSection
        label="피드백 완료"
        missions={done}
        emptyMessage="피드백 완료된 미션이 없어요."
        onMobileClick={handleMobileClick}
      />
      <LiveFeedbackSection
        label="기간 만료"
        missions={expired}
        emptyMessage="기간이 만료된 미션이 없어요."
        onMobileClick={handleMobileClick}
      />
    </div>
  );
};

export default LiveFeedbackPage;
