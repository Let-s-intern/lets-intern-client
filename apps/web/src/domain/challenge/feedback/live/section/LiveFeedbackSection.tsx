import FeedbackMissionCard from '@/domain/challenge/feedback/FeedbackMissionCard';
import LiveFeedbackDetail from '@/domain/challenge/feedback/live/LiveFeedbackDetail';
import type { LiveFeedbackMission } from '@/domain/challenge/feedback/live/types';
import {
  LIVE_FEEDBACK_BUTTON_LABELS,
  toCardConfig,
} from '@/domain/challenge/feedback/live/utils';

interface Props {
  label: string;
  missions: LiveFeedbackMission[];
  emptyMessage: string;
  onMobileClick: (mission: LiveFeedbackMission) => void;
  challengeName: string;
}

export default function LiveFeedbackSection({
  label,
  missions,
  emptyMessage,
  onMobileClick,
  challengeName,
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
                key={mission.id}
                config={toCardConfig(mission)}
                buttonLabel={labels?.buttonLabel}
                openLabel={labels?.openLabel}
                onClick={() => onMobileClick(mission)}
              >
                <LiveFeedbackDetail
                  assignedMentor={mission.assignedMentor}
                  period={{
                    startDay: mission.startDay,
                    endDay: mission.endDay,
                  }}
                  reservationInfo={mission.reservationInfo}
                  status={mission.status}
                  challengeName={challengeName}
                  missionName={mission.title}
                />
              </FeedbackMissionCard>
            );
          })}
        </div>
      )}
    </section>
  );
}
