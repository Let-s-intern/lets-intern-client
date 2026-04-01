'use client';

import {
  FeedbackStatusMapping,
  type FeedbackStatus,
} from '@/api/challenge/challengeSchema';

interface MenteeData {
  id: number | null;
  name: string;
  status: string | null;
  feedbackStatus: FeedbackStatus | null;
  link?: string | null;
  wishJob?: string | null;
  wishCompany?: string | null;
}

interface MenteeInfoProps {
  mentee: MenteeData | null;
  challengeTitle?: string;
  collapsed?: boolean;
}

function getFeedbackStatusStyle(status: FeedbackStatus | null): string {
  const isCompleted = status === 'COMPLETED' || status === 'CONFIRMED';
  if (isCompleted) return 'text-neutral-700';
  if (status === 'IN_PROGRESS') return 'text-blue-500';
  return 'text-red-500';
}

/** Reusable label-value row for mentee detail fields */
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="shrink-0 text-xs text-neutral-500">{label}</span>
    <span className="flex-1 text-xs font-medium text-neutral-700">{value}</span>
  </div>
);

const EMPTY_STATE = (
  <div className="rounded-xl border border-gray-200 p-6 text-sm text-neutral-400">
    멘티를 선택해주세요.
  </div>
);

const MenteeInfo = ({
  mentee,
  challengeTitle,
  collapsed = false,
}: MenteeInfoProps) => {
  if (!mentee) return EMPTY_STATE;

  const isAbsent = mentee.status === 'ABSENT' || mentee.id == null;
  const isSubmitted = !isAbsent;
  const hasSubmissionLink = isSubmitted && !!mentee.link;
  const feedbackStatusLabel = isAbsent
    ? '미제출'
    : (FeedbackStatusMapping[mentee.feedbackStatus ?? 'WAITING'] ?? '진행전');
  const feedbackStatusStyle = isAbsent
    ? 'text-orange-500'
    : getFeedbackStatusStyle(mentee.feedbackStatus);

  // 최소화 모드: 이름, 희망 직군, 희망 기업, 제출물 보기
  if (collapsed) {
    return (
      <div className="flex items-center gap-x-4 gap-y-1 rounded-lg border border-gray-200 px-4 py-2.5">
        <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-sm font-semibold text-neutral-900">
            {mentee.name}
          </span>
          {mentee.wishJob && (
            <span className="text-xs text-neutral-500">
              희망 직군: <span className="font-medium text-neutral-700">{mentee.wishJob}</span>
            </span>
          )}
          {mentee.wishCompany && (
            <span className="text-xs text-neutral-500">
              희망 기업: <span className="font-medium text-neutral-700">{mentee.wishCompany}</span>
            </span>
          )}
          <span className={`text-xs font-medium ${feedbackStatusStyle}`}>
            {feedbackStatusLabel}
          </span>
        </div>
        {hasSubmissionLink && (
          <a
            href={mentee.link!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 rounded border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 md:gap-5 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:gap-7">
        {/* Left column */}
        <div className="flex flex-1 flex-col gap-7">
          {/* Name + challenge */}
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-lg font-semibold text-neutral-900 md:text-2xl">
              {mentee.name}
            </h3>
            <span className="text-xs font-medium text-neutral-500">
              {challengeTitle ?? ''}
            </span>
          </div>

          {/* Submission status + link */}
          <div className="flex flex-col gap-1.5">
            <InfoRow label="제출 상태" value={isSubmitted ? '제출됨' : '미제출'} />
            {hasSubmissionLink ? (
              <a
                href={mentee.link!}
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
            ) : null}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-3">
            {mentee.wishJob ? <InfoRow label="희망 직군" value={mentee.wishJob} /> : null}
            {mentee.wishCompany ? <InfoRow label="희망 기업" value={mentee.wishCompany} /> : null}
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
