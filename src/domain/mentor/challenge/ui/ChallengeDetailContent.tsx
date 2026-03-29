'use client';

import { useMemo } from 'react';

import {
  useMentorMissionFeedbackAttendanceQuery,
} from '@/api/challenge/challenge';
import type { FeedbackStatus } from '@/api/challenge/challengeSchema';

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
};

interface MissionRowMission {
  id: number;
  title?: string | null | undefined;
  th: number;
  startDate: string;
  endDate: string;
  challengeOptionTitle?: string | null;
}

/** Counts attendance statuses for a single mission */
const MissionRow = ({
  mission,
  challengeId,
  onClickFeedback,
}: {
  mission: MissionRowMission;
  challengeId: number;
  onClickFeedback: (missionId: number, missionTh: number) => void;
}) => {
  const { data } = useMentorMissionFeedbackAttendanceQuery({
    challengeId,
    missionId: mission.id,
    enabled: !!challengeId && !!mission.id,
  });

  const attendanceList = data?.attendanceList ?? [];
  const total = attendanceList.length;

  // Single-pass aggregation: submitted count + feedback status
  const { submittedCount, completedCount, missionStatus } = useMemo(() => {
    let submitted = 0;
    let completed = 0;
    let feedbackStarted = 0;

    for (const a of attendanceList) {
      if (a.status !== 'ABSENT') submitted++;
      const status = a.feedbackStatus ?? 'WAITING';
      if (status === 'COMPLETED' || status === 'CONFIRMED') completed++;
      if (status !== 'WAITING') feedbackStarted++;
    }

    const hasSubmission = submitted > 0;
    const isAllComplete = hasSubmission && completed >= submitted;
    const s: 'completed' | 'inProgress' | 'waiting' | 'none' = !hasSubmission ? 'none' : isAllComplete ? 'completed' : feedbackStarted > 0 ? 'inProgress' : 'waiting';

    return {
      submittedCount: submitted,
      completedCount: completed,
      missionStatus: s,
    };
  }, [attendanceList]);

  const statusConfig = {
    completed: { label: '완료', className: 'bg-green-100 text-green-700' },
    inProgress: { label: '진행중', className: 'bg-yellow-100 text-yellow-700' },
    waiting: { label: '진행전', className: 'bg-gray-100 text-gray-500' },
    none: null,
  } as const;

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <span className="flex shrink-0 items-center justify-center rounded-full bg-primary-10 px-2.5 py-1 text-xs font-medium text-primary-dark">
          {mission.th}회차
        </span>
        <div className="flex flex-col gap-0.5">
          {mission.challengeOptionTitle ? (
            <span className="text-xs text-gray-400">
              {mission.challengeOptionTitle}
            </span>
          ) : null}
          <h3 className="font-medium text-gray-900">
            {mission.title || `${mission.th}회차 미션`}
          </h3>
          <p className="text-xs text-gray-400">
            {formatDate(mission.startDate)} ~ {formatDate(mission.endDate)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Submission stats */}
        <div className="text-right text-xs text-gray-500">
          <p>
            제출{' '}
            <span className="font-semibold text-gray-700">
              {submittedCount}
            </span>{' '}
            / {total}
          </p>
          <p>
            피드백 완료{' '}
            <span className="font-semibold text-green-600">
              {completedCount}
            </span>{' '}
            / {total}
          </p>
        </div>

        {/* Mission status badge */}
        {statusConfig[missionStatus] && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[missionStatus].className}`}
          >
            {statusConfig[missionStatus].label}
          </span>
        )}

        <button
          type="button"
          onClick={() => onClickFeedback(mission.id, mission.th)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          피드백 작성
        </button>
      </div>
    </div>
  );
};

interface ChallengeDetailContentProps {
  challengeId: number;
  missions: MissionRowMission[];
  isLoading: boolean;
  onClickFeedback: (missionId: number, missionTh: number) => void;
}

const ChallengeDetailContent = ({
  challengeId,
  missions,
  isLoading,
  onClickFeedback,
}: ChallengeDetailContentProps) => {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-gray-800">
        미션 목록 ({missions.length}개)
      </h2>

      {isLoading ? (
        <div className="py-8 text-center text-gray-400">로딩 중...</div>
      ) : missions.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          등록된 미션이 없습니다.
        </div>
      ) : (
        <div className="space-y-2">
          {missions.map((mission) => (
            <MissionRow
              key={mission.id}
              mission={mission}
              challengeId={challengeId}
              onClickFeedback={onClickFeedback}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeDetailContent;
