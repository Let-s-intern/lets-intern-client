'use client';

import { useMemo } from 'react';

import { useMentorAttendanceQuery } from '@/pages/feedback/hooks/useMentorAttendanceQuery';
import { deriveMissionStatus } from '@/pages/utils/deriveMissionStatus';

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
  challengeOptionType?: 'WRITTEN_FEEDBACK' | 'LIVE_FEEDBACK' | null;
}

/** Counts attendance statuses for a single mission */
const MissionRow = ({
  mission,
  challengeId,
  onClickFeedback,
  canOpenLiveMission,
  liveMenteeCount,
}: {
  mission: MissionRowMission;
  challengeId: number;
  onClickFeedback: (missionId: number, missionTh: number) => void;
  canOpenLiveMission: (missionTh: number) => boolean;
  liveMenteeCount: (missionTh: number) => number;
}) => {
  const isLive = mission.challengeOptionType === 'LIVE_FEEDBACK';
  // 라이브 미션인데 열 세션이 없으면 버튼 비활성(빈 모달을 열지 않음).
  const disabled = isLive && !canOpenLiveMission(mission.th);
  const { data } = useMentorAttendanceQuery({
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

    const missionStatus = deriveMissionStatus(
      submitted,
      completed,
      feedbackStarted,
    );

    return {
      submittedCount: submitted,
      completedCount: completed,
      missionStatus,
    };
  }, [attendanceList]);

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
          <div className="flex flex-col gap-0.5">
            {mission.challengeOptionTitle ? (
              <span
                className={`w-fit rounded px-1.5 py-0.5 text-[11px] font-medium ${
                  isLive
                    ? 'bg-red-50 text-red-500'
                    : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {mission.challengeOptionTitle}
              </span>
            ) : null}
            <h3 className="text-sm font-medium text-gray-900 md:text-base">
              {mission.title || `${mission.th}회차 미션`}
            </h3>
            <p className="text-xs text-gray-400">
              {formatDate(mission.startDate)} ~ {formatDate(mission.endDate)}
            </p>
          </div>
        </div>

        {/* Mission status badge — 서면 미션 전용(라이브는 제출/피드백 집계 의미가 달라 숨김) */}
        {!isLive && statusConfig[missionStatus] && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[missionStatus].className}`}
          >
            {statusConfig[missionStatus].label}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        {/* 집계 — 라이브는 예약 인원, 서면은 제출/피드백 완료 */}
        {isLive ? (
          <div className="text-xs text-gray-500 md:text-right">
            <p>
              예약{' '}
              <span className="font-semibold text-gray-700">
                {liveMenteeCount(mission.th)}
              </span>
              명
            </p>
          </div>
        ) : (
          <div className="text-xs text-gray-500 md:text-right">
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
        )}

        <button
          type="button"
          onClick={() => !disabled && onClickFeedback(mission.id, mission.th)}
          disabled={disabled}
          className={`min-h-[44px] w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors md:min-h-0 md:w-auto ${
            disabled
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-primary hover:bg-primary-hover text-white'
          }`}
        >
          {disabled ? '예약 없음' : '피드백 작성'}
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
  canOpenLiveMission: (missionTh: number) => boolean;
  liveMenteeCount: (missionTh: number) => number;
}

const ChallengeDetailContent = ({
  challengeId,
  missions,
  isLoading,
  onClickFeedback,
  canOpenLiveMission,
  liveMenteeCount,
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
              canOpenLiveMission={canOpenLiveMission}
              liveMenteeCount={liveMenteeCount}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeDetailContent;
