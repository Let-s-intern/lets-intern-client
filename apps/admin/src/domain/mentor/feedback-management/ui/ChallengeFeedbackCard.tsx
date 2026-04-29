import { useMemo } from 'react';

import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';
import { deriveMissionStatus } from '@/domain/mentor/utils/deriveMissionStatus';

type Challenge = MentorFeedbackManagement['challengeList'][number];
type Mission = Challenge['feedbackMissions'][number];

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
};

interface MissionRowProps {
  mission: Mission;
  onClickFeedback: (missionId: number, missionTh: number) => void;
}

const MissionRow = ({ mission, onClickFeedback }: MissionRowProps) => {
  const totalCount = mission.submittedCount + mission.notSubmittedCount;

  const { completedCount, missionStatus } = useMemo(() => {
    let completed = 0;
    let feedbackStarted = 0;
    for (const item of mission.feedbackStatusCounts) {
      if (
        item.feedbackStatus === 'COMPLETED' ||
        item.feedbackStatus === 'CONFIRMED'
      ) {
        completed += item.count;
      }
      if (item.feedbackStatus !== 'WAITING') {
        feedbackStarted += item.count;
      }
    }

    const missionStatus = deriveMissionStatus(
      mission.submittedCount,
      completed,
      feedbackStarted,
    );
    return { completedCount: completed, missionStatus };
  }, [mission.feedbackStatusCounts, mission.submittedCount]);

  const statusConfig = {
    completed: { label: '완료', className: 'bg-green-100 text-green-700' },
    inProgress: { label: '진행중', className: 'bg-yellow-100 text-yellow-700' },
    waiting: { label: '진행전', className: 'bg-gray-100 text-gray-500' },
    none: null,
  } as const;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 md:flex-row md:items-center md:justify-between md:p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-primary-10 text-primary-dark shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium">
            {mission.th}회차
          </span>
          <h3 className="text-sm font-medium text-gray-900 md:text-base">
            {mission.missionTitle || `${mission.th}회차 미션`}
          </h3>
        </div>

        {/* Mission status badge */}
        {statusConfig[missionStatus] && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[missionStatus].className}`}
          >
            {statusConfig[missionStatus].label}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        {/* Submission stats */}
        <div className="text-xs text-gray-500 md:text-right">
          <p>
            제출{' '}
            <span className="font-semibold text-gray-700">
              {mission.submittedCount}
            </span>{' '}
            / {totalCount}
          </p>
          <p>
            피드백 완료{' '}
            <span className="font-semibold text-green-600">
              {completedCount}
            </span>{' '}
            / {mission.submittedCount}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onClickFeedback(mission.missionId, mission.th)}
          className="bg-primary hover:bg-primary-hover min-h-[44px] w-full rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors md:min-h-0 md:w-auto"
        >
          피드백 작성
        </button>
      </div>
    </div>
  );
};

interface ChallengeFeedbackCardProps {
  challenge: Challenge;
  onMissionClick: (
    challenge: Challenge,
    missionId: number,
    missionTh: number,
  ) => void;
}

const ChallengeFeedbackCard = ({
  challenge,
  onMissionClick,
}: ChallengeFeedbackCardProps) => {
  const handleClickFeedback = (missionId: number, missionTh: number) => {
    onMissionClick(challenge, missionId, missionTh);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 md:p-6">
      {/* Challenge header */}
      <div className="mb-3 flex flex-col gap-1 md:mb-4">
        <h2 className="text-base font-bold text-gray-900 md:text-lg">
          {challenge.title ?? '챌린지'}
        </h2>
        {challenge.shortDesc ? (
          <p className="text-sm text-gray-500">{challenge.shortDesc}</p>
        ) : null}
        <p className="text-xs text-gray-400">
          {formatDate(challenge.startDate)} ~ {formatDate(challenge.endDate)}
        </p>
      </div>

      {/* Mission list */}
      {challenge.feedbackMissions.length === 0 ? (
        <div className="py-4 text-center text-sm text-gray-400">
          등록된 피드백 미션이 없습니다.
        </div>
      ) : (
        <div className="space-y-2">
          {challenge.feedbackMissions.map((mission) => (
            <MissionRow
              key={mission.missionId}
              mission={mission}
              onClickFeedback={handleClickFeedback}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeFeedbackCard;
