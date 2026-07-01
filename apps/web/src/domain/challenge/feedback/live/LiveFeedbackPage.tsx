'use client';

import { useLiveFeedbackListQuery } from '@/api/feedback/feedback';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import LiveFeedbackSection from '@/domain/challenge/feedback/live/section/LiveFeedbackSection';
import { toMission } from '@/domain/challenge/feedback/live/utils';
import { useMissionStore } from '@/store/useMissionStore';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { LiveFeedbackMission } from './types';

const LiveFeedbackPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { applicationId, programId } = useParams<{
    applicationId: string;
    programId: string;
  }>();
  const { currentChallenge } = useCurrentChallenge();

  const { data } = useLiveFeedbackListQuery(programId);

  const missions = useMemo(
    () =>
      (data?.liveFeedbackList ?? []).map((item) =>
        toMission(item, currentChallenge?.challengeType ?? ''),
      ),
    [data, currentChallenge?.challengeType],
  );

  const handleMobileClick = useCallback(
    (mission: LiveFeedbackMission) => {
      router.push(`${pathname}/${mission.missionTh}`);
    },
    [pathname, router],
  );

  const { setSelectedMission } = useMissionStore();

  const handleMissionClick = useCallback(
    (mission: LiveFeedbackMission) => {
      setSelectedMission(mission.missionId, mission.missionTh);
      router.push(`/challenge/${applicationId}/${programId}/me#mission-submit`);
    },
    [applicationId, programId, router, setSelectedMission],
  );

  const today = new Date();
  const started = missions.filter((m) => {
    const start = new Date(m.missionStartDate);
    start.setSeconds(0, 0);
    return start <= today;
  });

  const needReservation = started.filter((m) => m.status === 'prev');
  const reserved = started.filter((m) => m.status === 'reserved');
  const done = started.filter((m) => m.status === 'completed');
  const inactive = started.filter(
    (m) =>
      m.status === 'expired' ||
      m.status === 'nonParticipation' ||
      m.status === 'checkNeeded',
  );

  return (
    <div className="md:mb-22 mb-10 flex flex-col gap-10">
      <LiveFeedbackSection
        label="진행 전"
        missions={needReservation}
        emptyMessage="예약 필요한 미션이 없어요."
        challengeId={programId}
        onMissionClick={handleMissionClick}
        onMobileClick={handleMobileClick}
      />
      <LiveFeedbackSection
        label="진행 예정"
        missions={reserved}
        emptyMessage="예약 완료된 미션이 없어요."
        challengeId={programId}
        onMissionClick={handleMissionClick}
        onMobileClick={handleMobileClick}
      />
      <LiveFeedbackSection
        label="진행 완료"
        missions={done}
        emptyMessage="피드백 완료된 미션이 없어요."
        challengeId={programId}
        onMissionClick={handleMissionClick}
        onMobileClick={handleMobileClick}
      />
      {inactive.length > 0 && (
        <LiveFeedbackSection
          label="미진행"
          missions={inactive}
          emptyMessage="기간이 만료된 미션이 없어요."
          challengeId={programId}
          onMissionClick={handleMissionClick}
          onMobileClick={handleMobileClick}
        />
      )}
    </div>
  );
};

export default LiveFeedbackPage;
