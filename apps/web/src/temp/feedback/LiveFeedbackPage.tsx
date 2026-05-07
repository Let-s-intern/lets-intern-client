'use client';

import { DUMMY_FEEDBACK_MISSIONS } from '@/domain/challenge/feedback/dummy';
import FeedbackMissionCard from '@/domain/challenge/feedback/FeedbackMissionCard';
import LiveFeedbackDetail from '@/domain/challenge/feedback/live/LiveFeedbackDetail';
import type { LiveFeedbackMission } from '@/domain/challenge/feedback/live/types';
import {
  LIVE_FEEDBACK_BUTTON_LABELS,
  LIVE_FEEDBACK_SECTIONS,
  toCardConfig,
} from '@/domain/challenge/feedback/live/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface SectionProps {
  label: string;
  missions: LiveFeedbackMission[];
  emptyMessage: string;
  onMobileClick: (mission: LiveFeedbackMission) => void;
}

function LiveFeedbackSection({
  label,
  missions,
  emptyMessage,
  onMobileClick,
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
          {missions.map((mission) => {
            const { buttonLabel, openLabel } =
              LIVE_FEEDBACK_BUTTON_LABELS[mission.status];
            return (
              <FeedbackMissionCard
                key={mission.id}
                config={toCardConfig(mission)}
                buttonLabel={buttonLabel}
                openLabel={openLabel}
                onClick={() => onMobileClick(mission)}
              >
                <LiveFeedbackDetail
                  assignedMentor={mission.assignedMentor}
                  startDay={mission.startDay}
                  endDay={mission.endDay}
                  reservationInfo={mission.reservationInfo}
                  status={mission.status}
                />
              </FeedbackMissionCard>
            );
          })}
        </div>
      )}
    </section>
  );
}

const LiveFeedbackPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleMobileClick = useCallback(
    (mission: LiveFeedbackMission) => {
      const index = DUMMY_FEEDBACK_MISSIONS.findIndex(
        (m) => m.id === mission.id,
      );
      router.push(`${pathname}/${index}`);
    },
    [pathname, router],
  );

  return (
    <div className="flex flex-col gap-10">
      {LIVE_FEEDBACK_SECTIONS.map(({ status, label, emptyMessage }) => (
        <LiveFeedbackSection
          key={status}
          label={label}
          missions={DUMMY_FEEDBACK_MISSIONS.filter((m) => m.status === status)}
          emptyMessage={emptyMessage}
          onMobileClick={handleMobileClick}
        />
      ))}
    </div>
  );
};

export default LiveFeedbackPage;
