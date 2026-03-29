'use client';

import { useMemo } from 'react';

import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';
import {
  FeedbackStatusMapping,
  type FeedbackStatus,
} from '@/api/challenge/challengeSchema';

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

/** 피드백 전체 완료 여부 판단 */
function isMissionFeedbackComplete(mission: Mission): boolean {
  const totalSubmitted = mission.submittedCount;
  if (totalSubmitted === 0) return false;

  let completedCount = 0;
  for (const item of mission.feedbackStatusCounts) {
    if (item.feedbackStatus === 'COMPLETED' || item.feedbackStatus === 'CONFIRMED') {
      completedCount += item.count;
    }
  }
  return completedCount >= totalSubmitted;
}

interface MissionRowProps {
  mission: Mission;
  challengeTitle: string | null;
  challengeStartDate: string | null;
  challengeEndDate: string | null;
  onClickFeedback: (missionId: number, missionTh: number) => void;
}

const MissionRow = ({
  mission,
  challengeTitle,
  challengeStartDate,
  challengeEndDate,
  onClickFeedback,
}: MissionRowProps) => {
  const totalCount = mission.submittedCount + mission.notSubmittedCount;

  const completedCount = useMemo(() => {
    let count = 0;
    for (const item of mission.feedbackStatusCounts) {
      if (
        item.feedbackStatus === 'COMPLETED' ||
        item.feedbackStatus === 'CONFIRMED'
      ) {
        count += item.count;
      }
    }
    return count;
  }, [mission.feedbackStatusCounts]);

  const isComplete = isMissionFeedbackComplete(mission);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 md:p-5">
      {/* 상단: 회차 뱃지 + 미션 제목 + 완료 상태 */}
      <div className="flex items-center gap-2.5">
        <span className="shrink-0 rounded-md border border-primary/30 bg-primary-10 px-2.5 py-1 text-xs font-semibold text-primary-dark">
          {mission.th}회차
        </span>
        <span className="text-sm font-medium text-gray-900 md:text-base">
          {mission.missionTitle || `${mission.th}회차 미션`}
        </span>
        {isComplete && (
          <span className="flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-500">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-gray-400"
            >
              <path
                d="M2.5 6L5 8.5L9.5 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            완료
          </span>
        )}
      </div>

      {/* 하단: 미션 정보 + 통계 + 버튼 */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* 좌측: 날짜 정보 */}
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-gray-900 md:text-base">
            {challengeTitle ?? '챌린지'}
          </p>
          <p className="text-xs text-gray-400">
            {formatDate(challengeStartDate)} ~{formatDate(challengeEndDate)}
          </p>
        </div>

        {/* 우측: 통계 + 버튼 */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* 제출/피드백 완료 카운트 */}
          <div className="flex flex-col gap-0.5 text-right text-xs text-gray-500 md:text-sm">
            <p>
              제출{' '}
              <span className="font-bold text-gray-900">
                {mission.submittedCount}
              </span>{' '}
              / {totalCount}
            </p>
            <p>
              피드백 완료{' '}
              <span className="font-bold text-primary">
                {completedCount}
              </span>{' '}
              / {totalCount}
            </p>
          </div>

          {/* 피드백 작성 버튼 */}
          <button
            type="button"
            onClick={() => onClickFeedback(mission.missionId, mission.th)}
            className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover md:min-h-0 md:px-6 md:py-3"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M8 3.5V12.5M3.5 8H12.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            피드백 작성
          </button>
        </div>
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
    <div className="flex flex-col gap-3">
      {/* Challenge header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-bold text-gray-900 md:text-lg">
          {challenge.title ?? '챌린지'}
        </h2>
        {challenge.shortDesc ? (
          <p className="text-sm text-gray-500">{challenge.shortDesc}</p>
        ) : null}
      </div>

      {/* Mission list */}
      {challenge.feedbackMissions.length === 0 ? (
        <div className="py-4 text-center text-sm text-gray-400">
          등록된 피드백 미션이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {challenge.feedbackMissions.map((mission) => (
            <MissionRow
              key={mission.missionId}
              mission={mission}
              challengeTitle={challenge.title}
              challengeStartDate={challenge.startDate}
              challengeEndDate={challenge.endDate}
              onClickFeedback={handleClickFeedback}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeFeedbackCard;
