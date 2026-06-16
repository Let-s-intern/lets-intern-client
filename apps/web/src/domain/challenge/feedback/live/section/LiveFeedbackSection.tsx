import { useFeedbackDetailQuery } from '@/api/feedback/feedback';
import FeedbackMissionCard from '@/domain/challenge/feedback/FeedbackMissionCard';
import type { MobilePrimaryAction } from '@/domain/challenge/feedback/FeedbackMissionCard';
import LiveFeedbackDetail from '@/domain/challenge/feedback/live/LiveFeedbackDetail';
import type {
  FeedbackInfo,
  LiveFeedbackMission,
} from '@/domain/challenge/feedback/live/types';
import {
  LIVE_FEEDBACK_BUTTON_LABELS,
  isEntranceActive,
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

function getAccordionLabels(mission: LiveFeedbackMission) {
  if (mission.status === 'prev' && mission.feedbackId) {
    return { buttonLabel: '신청 내역 보기', openLabel: '신청 내역 닫기' };
  }
  return LIVE_FEEDBACK_BUTTON_LABELS[mission.status];
}

function getMissionButtonLabel(mission: LiveFeedbackMission) {
  if (
    mission.status === 'expired' ||
    mission.status === 'nonParticipation' ||
    mission.status === 'checkNeeded'
  )
    return undefined;
  return mission.isMissionSubmitted ? '제출된 미션 보기' : '미션 제출하기';
}

function getMobilePrimaryAction(
  mission: LiveFeedbackMission,
  feedbackInfo: FeedbackInfo | null,
  onNavigate: () => void,
): MobilePrimaryAction | undefined {
  const { status, feedbackId } = mission;

  if (
    status === 'expired' ||
    status === 'nonParticipation' ||
    status === 'checkNeeded'
  )
    return undefined;

  if (status === 'prev') {
    return {
      label: feedbackId ? '신청 내역 보기' : '예약 신청 하기',
      onClick: onNavigate,
    };
  }

  if (status === 'reserved') {
    const entranceActive = isEntranceActive(
      feedbackInfo?.startDate,
      feedbackInfo?.endDate,
    );
    return {
      label: 'LIVE 피드백 입장하기',
      href: feedbackInfo?.meetingUrl ?? undefined,
      disabled: !entranceActive,
      isEntrance: true,
    };
  }

  if (status === 'completed') {
    return { label: 'LIVE 피드백 회고하기', onClick: onNavigate };
  }

  return undefined;
}

const EXPIRED_NOTICE = {
  noReservation: {
    title: '예약 기간이 만료되었습니다.',
    body: '예약 신청을 하지 않아 LIVE 피드백이 진행되지 않았습니다.',
  },
  noSubmission: {
    title: '미션 제출 기간이 만료되었습니다.',
    body: '미션을 제출하지 않아 LIVE 피드백이 진행되지 않았습니다.',
  },
};

const NoticeBox = ({ title, body }: { title: string; body: string }) => (
  <div className="bg-primary-5 rounded-xs hidden gap-2 border px-4 py-2 md:flex">
    <img src="/icons/info.svg" alt="" className="size-4" />
    <div className="flex flex-col gap-0.5">
      <p className="text-xxsmall12 text-system-positive-blue items-center">
        {title}
      </p>
      <p className="text-xxsmall12 text-neutral-20">{body}</p>
    </div>
  </div>
);

const ExpiredNotice = ({ hasReservation }: { hasReservation: boolean }) => {
  const { title, body } = hasReservation
    ? EXPIRED_NOTICE.noSubmission
    : EXPIRED_NOTICE.noReservation;

  return (
    <NoticeBox
      title={title}
      body={`${body} 기간 내에 예약과 미션 제출이 모두 이루어져야 피드백을 받을 수 있습니다.`}
    />
  );
};

const NonParticipationNotice = () => (
  <NoticeBox
    title="LIVE 피드백 시간이 종료되었습니다."
    body="예약 시간 내 입장이 확인되지 않아 피드백이 진행되지 않았습니다."
  />
);

interface MissionCardProps {
  mission: LiveFeedbackMission;
  challengeId: string | number;
  onMissionClick: (mission: LiveFeedbackMission) => void;
  onMobileClick: (mission: LiveFeedbackMission) => void;
}

const LiveFeedbackMissionCard = ({
  mission,
  challengeId,
  onMissionClick,
  onMobileClick,
}: MissionCardProps) => {
  const { data: feedbackDetailData } = useFeedbackDetailQuery(
    mission.feedbackId,
  );
  const feedbackInfo = feedbackDetailData?.feedbackInfo ?? null;

  const labels = getAccordionLabels(mission);
  const missionButtonLabel = getMissionButtonLabel(mission);
  const mobilePrimaryAction = getMobilePrimaryAction(
    mission,
    feedbackInfo,
    () => onMobileClick(mission),
  );

  return (
    <FeedbackMissionCard
      config={toCardConfig(mission, feedbackInfo)}
      buttonLabel={missionButtonLabel}
      onClick={() => onMissionClick(mission)}
      accordionLabel={labels?.buttonLabel}
      openLabel={labels?.openLabel}
      mobilePrimaryAction={mobilePrimaryAction}
      notice={
        mission.status === 'expired' ? (
          <ExpiredNotice hasReservation={!!mission.feedbackId} />
        ) : mission.status === 'nonParticipation' ? (
          <NonParticipationNotice />
        ) : undefined
      }
    >
      <LiveFeedbackDetail challengeId={challengeId} mission={mission} />
    </FeedbackMissionCard>
  );
};

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
          {missions.map((mission) => (
            <LiveFeedbackMissionCard
              key={mission.missionTh}
              mission={mission}
              challengeId={challengeId}
              onMissionClick={onMissionClick}
              onMobileClick={onMobileClick}
            />
          ))}
        </div>
      )}
    </section>
  );
}
