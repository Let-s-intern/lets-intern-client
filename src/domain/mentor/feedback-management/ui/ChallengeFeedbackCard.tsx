'use client';

import { useMemo } from 'react';

import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';
import {
  FeedbackStatusMapping,
  type FeedbackStatus,
} from '@/api/challenge/challengeSchema';
import StatusBadge from '@/domain/mentor/ui/StatusBadge';

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

  // Build feedback status counts from the array
  const feedbackCountMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of mission.feedbackStatusCounts) {
      map.set(item.feedbackStatus, item.count);
    }
    return map;
  }, [mission.feedbackStatusCounts]);

  const completedCount =
    (feedbackCountMap.get('COMPLETED') ?? 0) +
    (feedbackCountMap.get('CONFIRMED') ?? 0);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 md:flex-row md:items-center md:justify-between md:p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-primary-10 px-3 py-1.5 text-xs font-medium text-primary-dark md:min-h-0 md:px-2.5 md:py-1">
            {mission.th}회차
          </span>
          <h3 className="text-sm font-medium text-gray-900 md:text-base">
            {mission.missionTitle || `${mission.th}회차 미션`}
          </h3>
        </div>

        {/* Feedback status badges */}
        <div className="flex shrink-0 flex-wrap gap-1">
          {(
            Object.keys(FeedbackStatusMapping) as FeedbackStatus[]
          ).map((key) => (
            <StatusBadge
              key={key}
              status={key}
              count={feedbackCountMap.get(key) ?? 0}
            />
          ))}
        </div>
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
          className="min-h-[44px] w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover md:min-h-0 md:w-auto"
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
