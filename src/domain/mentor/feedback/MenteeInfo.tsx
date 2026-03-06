'use client';

import {
  useMentorMissionFeedbackAttendanceQuery,
} from '@/api/challenge/challenge';
import { FeedbackStatusMapping } from '@/api/challenge/challengeSchema';
import type { FeedbackStatus } from '@/api/challenge/challengeSchema';

interface MenteeInfoProps {
  challengeId: number;
  missionId: number;
  attendanceId: number | null;
  challengeTitle?: string;
}

function getFeedbackStatusStyle(status: FeedbackStatus | null): string {
  switch (status) {
    case 'IN_PROGRESS':
      return 'text-blue-500';
    case 'COMPLETED':
    case 'CONFIRMED':
      return 'text-neutral-700';
    case 'WAITING':
    default:
      return 'text-red-500';
  }
}

const MenteeInfo = ({
  challengeId,
  missionId,
  attendanceId,
  challengeTitle,
}: MenteeInfoProps) => {
  const { data } = useMentorMissionFeedbackAttendanceQuery({
    challengeId,
    missionId,
    enabled: !!challengeId && !!missionId,
  });

  const mentee = data?.attendanceList?.find((a) => a.id === attendanceId);

  if (!mentee) {
    return (
      <div className="rounded-lg border border-neutral-300 p-7 text-sm text-neutral-400">
        멘티를 선택해주세요.
      </div>
    );
  }

  const isSubmitted = mentee.status !== 'ABSENT';
  const feedbackStatusLabel =
    FeedbackStatusMapping[mentee.feedbackStatus ?? 'WAITING'] ?? '진행전';
  const feedbackStatusStyle = getFeedbackStatusStyle(mentee.feedbackStatus);

  return (
    <div className="flex flex-col gap-7 rounded-lg border border-neutral-300 p-7">
      <div className="flex gap-7">
        {/* Left column */}
        <div className="flex flex-1 flex-col gap-7">
          {/* Name + challenge */}
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold text-neutral-900 line-clamp-1">
              {mentee.name}
            </h3>
            <span className="text-xs font-medium text-neutral-700">
              {challengeTitle ?? ''}
            </span>
          </div>

          {/* Submission status + link */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-2">
              <span className="text-xs text-neutral-500">제출 상태</span>
              <span className="text-xs font-medium text-neutral-700">
                {isSubmitted ? '제출됨' : '미제출'}
              </span>
            </div>
            {isSubmitted && mentee.link && (
              <a
                href={mentee.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1 rounded border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 3.5H3.5V12.5H12.5V10M9.5 3.5H12.5V6.5M12.5 3.5L7 9"
                    stroke="#4D55F5"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                제출물 보기
              </a>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-3">
            {mentee.wishJob && (
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-xs text-neutral-500">희망 직군</span>
                <span className="flex-1 text-xs font-medium text-neutral-700">
                  {mentee.wishJob}
                </span>
              </div>
            )}
            {mentee.wishIndustry && (
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-xs text-neutral-500">희망 산업</span>
                <span className="flex-1 text-xs font-medium text-neutral-700">
                  {mentee.wishIndustry}
                </span>
              </div>
            )}
            {mentee.wishCompany && (
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-xs text-neutral-500">희망 기업</span>
                <span className="flex-1 text-xs font-medium text-neutral-700">
                  {mentee.wishCompany}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs text-neutral-500">피드백 상태</span>
            <span className={`text-xs font-medium ${feedbackStatusStyle}`}>
              {feedbackStatusLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeInfo;
