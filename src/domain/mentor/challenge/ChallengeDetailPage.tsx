'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

import {
  useMentorMissionFeedbackListQuery,
  useMentorMissionFeedbackAttendanceQuery,
} from '@/api/challenge/challenge';
import { useMentorChallengeListQuery } from '@/api/user/user';
import {
  FeedbackStatusMapping,
  type FeedbackStatus,
} from '@/api/challenge/challengeSchema';
import FeedbackModal from '@/domain/mentor/feedback/FeedbackModal';

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
};

/** Counts attendance statuses for a single mission */
const MissionRow = ({
  mission,
  challengeId,
  challengeTitle,
  onClickFeedback,
}: {
  mission: {
    id: number;
    title?: string | null | undefined;
    th: number;
    startDate: string;
    endDate: string;
    challengeOptionTitle?: string | null;
  };
  challengeId: number;
  challengeTitle: string;
  onClickFeedback: (missionId: number, missionTh: number) => void;
}) => {
  const { data } = useMentorMissionFeedbackAttendanceQuery({
    challengeId,
    missionId: mission.id,
    enabled: !!challengeId && !!mission.id,
  });

  const attendanceList = data?.attendanceList ?? [];
  const total = attendanceList.length;
  const submitted = attendanceList.filter(
    (a) => a.status !== 'ABSENT',
  ).length;

  const feedbackCounts = attendanceList.reduce(
    (acc, a) => {
      const status = a.feedbackStatus ?? 'WAITING';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const completedCount =
    (feedbackCounts['COMPLETED'] ?? 0) + (feedbackCounts['CONFIRMED'] ?? 0);

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
            {mission.th}회차
          </span>
          {mission.challengeOptionTitle && (
            <span className="text-xs text-gray-400">
              {mission.challengeOptionTitle}
            </span>
          )}
        </div>
        <h3 className="font-medium text-gray-900">
          {mission.title || `${mission.th}회차 미션`}
        </h3>
        <p className="text-xs text-gray-400">
          {formatDate(mission.startDate)} ~ {formatDate(mission.endDate)}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Submission stats */}
        <div className="text-right text-xs text-gray-500">
          <p>
            제출 <span className="font-semibold text-gray-700">{submitted}</span>{' '}
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

        {/* Feedback status badges */}
        <div className="flex gap-1">
          {(
            Object.entries(FeedbackStatusMapping) as [FeedbackStatus, string][]
          ).map(([key, label]) => {
            const count = feedbackCounts[key] ?? 0;
            if (count === 0) return null;
            return (
              <span
                key={key}
                className={`rounded-full px-2 py-0.5 text-xs ${
                  key === 'COMPLETED' || key === 'CONFIRMED'
                    ? 'bg-green-100 text-green-700'
                    : key === 'IN_PROGRESS'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-500'
                }`}
              >
                {label} {count}
              </span>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onClickFeedback(mission.id, mission.th)}
          className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          피드백 작성
        </button>
      </div>
    </div>
  );
};

const ChallengeDetailPage = () => {
  const params = useParams<{ challengeId: string }>();
  const challengeId = Number(params.challengeId);

  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    missionId: number;
    missionTh: number;
  }>({ isOpen: false, missionId: 0, missionTh: 0 });

  // Get challenge title from list
  const { data: challengeListData } = useMentorChallengeListQuery();
  const challenge = challengeListData?.myChallengeMentorVoList.find(
    (c) => c.challengeId === challengeId,
  );
  const challengeTitle = challenge?.title ?? '';

  // Get mission list
  const { data: missionData, isLoading } =
    useMentorMissionFeedbackListQuery(challengeId);
  const missions = missionData?.missionList ?? [];

  const handleClickFeedback = (missionId: number, missionTh: number) => {
    setFeedbackModal({ isOpen: true, missionId, missionTh });
  };

  const handleCloseModal = () => {
    setFeedbackModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{challengeTitle}</h1>
        {challenge && (
          <p className="mt-1 text-sm text-gray-500">{challenge.shortDesc}</p>
        )}
      </div>

      {/* Mission list */}
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
                challengeTitle={challengeTitle}
                onClickFeedback={handleClickFeedback}
              />
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal - reuse existing */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={handleCloseModal}
        challengeId={challengeId}
        missionId={feedbackModal.missionId}
        challengeTitle={challengeTitle}
        missionTh={feedbackModal.missionTh}
      />
    </div>
  );
};

export default ChallengeDetailPage;
