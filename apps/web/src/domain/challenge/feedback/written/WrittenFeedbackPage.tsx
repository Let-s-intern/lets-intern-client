'use client';

import { useWrittenFeedbackListQuery } from '@/api/feedback/feedback';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import FeedbackMissionCard from '@/domain/challenge/feedback/FeedbackMissionCard';
import type { WrittenFeedbackMission } from '@/domain/challenge/feedback/written/types';
import {
  WRITTEN_FEEDBACK_BUTTON_LABEL,
  WRITTEN_FEEDBACK_SECTIONS,
  toWrittenCardConfig,
  toWrittenMission,
} from '@/domain/challenge/feedback/written/utils';
import { useExperienceLevel } from '@/hooks/useExperienceLevel';
import { useMissionStore } from '@/store/useMissionStore';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface SectionProps {
  label: string;
  missions: WrittenFeedbackMission[];
  emptyMessage: string;
  onCardClick: (mission: WrittenFeedbackMission) => void;
}

function FeedbackSection({
  label,
  missions,
  emptyMessage,
  onCardClick,
}: SectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">{label}</h1>
      {missions.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-4 py-14">
          <p className="text-xsmall14 text-neutral-20 font-normal">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:flex md:flex-col md:gap-y-5">
          {missions.map((mission) => (
            <FeedbackMissionCard
              key={mission.id}
              config={toWrittenCardConfig(mission)}
              buttonLabel={
                WRITTEN_FEEDBACK_BUTTON_LABEL[mission.status] || undefined
              }
              onClick={() => onCardClick(mission)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

const WrittenFeedbackPage = () => {
  const router = useRouter();
  const params = useParams<{ applicationId: string; programId: string }>();
  const { currentChallenge, schedules } = useCurrentChallenge();
  const experienceLevel = useExperienceLevel(schedules);

  const { data } = useWrittenFeedbackListQuery(params.programId);

  const excludedMissionIds = useMemo(() => {
    const typeToExclude =
      experienceLevel === 'LV1' ? 'EXPERIENCE_2' : 'EXPERIENCE_1';
    return new Set(
      schedules
        .filter((s) => s.missionInfo.missionType === typeToExclude)
        .map((s) => s.missionInfo.id),
    );
  }, [schedules, experienceLevel]);

  const missions = useMemo(
    () =>
      (data?.writtenFeedbackList ?? [])
        .filter((item) => !excludedMissionIds.has(item.missionId))
        .map((item) =>
          toWrittenMission(item, currentChallenge?.challengeType ?? ''),
        ),
    [data, currentChallenge?.challengeType, excludedMissionIds],
  );

  const today = new Date();
  const started = missions.filter((m) => {
    const start = new Date(m.startDay);
    start.setSeconds(0, 0);
    return start <= today;
  });

  const { setSelectedMission } = useMissionStore();

  const handleClick = useCallback(
    (mission: WrittenFeedbackMission) => {
      setSelectedMission(mission.missionId, mission.missionNumber);
      const base = `/challenge/${params.applicationId}/${params.programId}/me`;
      if (mission.status === 'confirmed') {
        router.push(`${base}#mentor-feedback`);
      } else if (mission.status === 'waiting') {
        router.push(`${base}#mission-submit`);
      } else {
        router.push(base);
      }
    },
    [params.applicationId, params.programId, router, setSelectedMission],
  );

  return (
    <div className="flex flex-col gap-10">
      {WRITTEN_FEEDBACK_SECTIONS.map(({ status, label, emptyMessage }) => {
        const sectionMissions = started.filter((m) => m.status === status);
        if (status === 'expired' && sectionMissions.length === 0) return null;
        return (
          <FeedbackSection
            key={status}
            label={label}
            missions={sectionMissions}
            emptyMessage={emptyMessage}
            onCardClick={handleClick}
          />
        );
      })}
    </div>
  );
};

export default WrittenFeedbackPage;
