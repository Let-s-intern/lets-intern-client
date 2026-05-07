'use client';

import { DUMMY_WRITTEN_FEEDBACK_MISSIONS } from '@/domain/challenge/feedback/dummy';
import FeedbackMissionCard from '@/domain/challenge/feedback/FeedbackMissionCard';
import type { WrittenFeedbackMission } from '@/domain/challenge/feedback/written/types';
import {
  WRITTEN_FEEDBACK_BUTTON_LABEL,
  WRITTEN_FEEDBACK_SECTIONS,
  toWrittenCardConfig,
} from '@/domain/challenge/feedback/written/utils';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

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
              buttonLabel={WRITTEN_FEEDBACK_BUTTON_LABEL[mission.status]}
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

  const handleClick = useCallback(
    (mission: WrittenFeedbackMission) => {
      const base = `/challenge/${params.applicationId}/${params.programId}/me`;
      if (mission.status === 'done') {
        router.push(`${base}#mentor-feedback`);
      } else if (mission.status === 'submitted') {
        router.push(`${base}#mission-submit`);
      } else {
        router.push(base);
      }
    },
    [params.applicationId, params.programId, router],
  );

  return (
    <div className="flex flex-col gap-10">
      {WRITTEN_FEEDBACK_SECTIONS.map(({ status, label, emptyMessage }) => (
        <FeedbackSection
          key={status}
          label={label}
          missions={DUMMY_WRITTEN_FEEDBACK_MISSIONS.filter(
            (m) => m.status === status,
          )}
          emptyMessage={emptyMessage}
          onCardClick={handleClick}
        />
      ))}
    </div>
  );
};

export default WrittenFeedbackPage;
