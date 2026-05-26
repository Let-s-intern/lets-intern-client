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

const ExpiredNotice = () => (
  <div className="bg-primary-5 rounded-xs md:blick hidden gap-2 border px-4 py-2 md:flex">
    <img src="/icons/info.svg" alt="" className="size-4" />
    <div className="flex flex-col gap-0.5">
      <p className="text-xxsmall12 text-system-positive-blue items-center">
        미션 제출 기간이 만료되었습니다.
      </p>
      <p className="text-xxsmall12 text-neutral-20">
        미션을 제출하지 않아 LIVE 피드백이 진행되지 않았습니다. 기간 내에 예약과
        미션 제출이 모두 이루어져야 피드백을 받을 수 있습니다.
      </p>
    </div>
  </div>
);

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
                notice={
                  mission.status === 'expired' ? <ExpiredNotice /> : undefined
                }
              >
                <LiveFeedbackDetail
                  challengeId={challengeId}
                  missionTh={mission.missionTh}
                  assignedMentor={mission.mentorInfo}
                  period={{
                    startDay: mission.missionStartDate,
                    endDay: mission.missionEndDate,
                  }}
                  feedbackInfo={mission.feedbackInfo}
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
