import FeedbackMissionCard from '@/domain/challenge/feedback/FeedbackMissionCard';
import LiveFeedbackDetail from '@/domain/challenge/feedback/live/LiveFeedbackDetail';
import type { LiveFeedbackMission } from '@/domain/challenge/feedback/live/types';
import {
  LIVE_FEEDBACK_BUTTON_LABELS,
  LIVE_MISSION_BUTTON_LABEL,
  toCardConfig,
} from '@/domain/challenge/feedback/live/utils';

interface Props {
  label: string;
  missions: LiveFeedbackMission[];
  emptyMessage: string;
  challengeId: string | number;
  onMissionClick: (mission: LiveFeedbackMission) => void;
  onMobileClick: (mission: LiveFeedbackMission) => void;
}

export default function LiveFeedbackSection({
  label,
  missions,
  emptyMessage,
  challengeId,
  onMissionClick,
  onMobileClick,
}: Props) {
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
            const labels = LIVE_FEEDBACK_BUTTON_LABELS[mission.status];
            return (
              <FeedbackMissionCard
                key={mission.missionTh}
                config={toCardConfig(mission)}
                buttonLabel={LIVE_MISSION_BUTTON_LABEL[mission.status]}
                onClick={() => onMissionClick(mission)}
                accordionLabel={labels?.buttonLabel}
                openLabel={labels?.openLabel}
                onAccordionMobileClick={() => onMobileClick(mission)}
              >
                <LiveFeedbackDetail
                  challengeId={challengeId}
                  assignedMentor={mission.mentorInfo}
                  period={{
                    startDay: mission.missionStartDate,
                    endDay: mission.missionEndDate,
                  }}
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
