'use client';

import { twMerge } from '@/lib/twMerge';

import {
  FeedbackStatusMapping,
  type FeedbackStatus,
} from '@/api/challenge/challengeSchema';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';
import { isNotionUrl } from '../utils/notion';
import { getWrittenFeedbackBadgeVisual } from '../utils/writtenFeedbackStatus';
import SideViewButton from './SideViewButton';

interface MenteeData {
  id: number | null;
  userId?: number | null;
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
  /** 멘티가 작성한 사전 질문 (서면 상세 응답에서 전달). 없으면 미표시. */
  preQuestion?: string | null;
  /** 경험정리형 제출물(링크 없음·제출됨) 보기 진입 */
  onViewExperience?: () => void;
  /** 경험을 모달 왼쪽 패널에 띄워 보면서 피드백 작성 */
  onViewExperienceSide?: () => void;
  /** 노션 제출물을 모달 왼쪽 패널에 임베드해 보면서 피드백 작성 */
  onViewLinkSide?: () => void;
}

const ExternalLinkIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M6 3.5H3.5V12.5H12.5V10M9.5 3.5H12.5V6.5M12.5 3.5L7 9"
      stroke="#4D55F5"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function getFeedbackStatusStyle(status: FeedbackStatus | null): string {
  const isCompleted = status === 'COMPLETED' || status === 'CONFIRMED';
  if (isCompleted) return 'text-neutral-700';
  if (status === 'IN_PROGRESS') return 'text-blue-500';
  return 'text-red-500';
}

const EMPTY_STATE = (
  <div className="border-neutral-80 rounded-[4px] border p-6 text-sm text-neutral-400">
    멘티를 선택해주세요.
  </div>
);

const MenteeInfo = ({
  mentee,
  challengeTitle,
  collapsed = false,
  preQuestion,
  onViewExperience,
  onViewExperienceSide,
  onViewLinkSide,
}: MenteeInfoProps) => {
  if (!mentee) return EMPTY_STATE;

  const isAbsent = mentee.status === 'ABSENT' || mentee.id == null;
  const isSubmitted = !isAbsent;
  const hasSubmissionLink = isSubmitted && !!mentee.link;
  // 노션 링크만 왼쪽 패널 임베드 진입점 노출
  const canEmbedLink = hasSubmissionLink && isNotionUrl(mentee.link);
  // 링크형이 아닌 제출물(경험정리형) → 경험 보기 진입점 노출
  const hasExperienceSubmission =
    isSubmitted && !mentee.link && mentee.userId != null;
  // 임시저장(저장만 하고 미제출)은 서버에서 IN_PROGRESS 로 보관된다 → 라벨에 표시.
  const isDraftSaved = !isAbsent && mentee.feedbackStatus === 'IN_PROGRESS';
  const baseFeedbackStatusLabel = isAbsent
    ? '미제출'
    : (FeedbackStatusMapping[mentee.feedbackStatus ?? 'WAITING'] ?? '진행전');
  const feedbackStatusLabel = isDraftSaved
    ? `${baseFeedbackStatusLabel} · 임시저장됨`
    : baseFeedbackStatusLabel;
  const feedbackStatusStyle = isAbsent
    ? 'text-orange-500'
    : getFeedbackStatusStyle(mentee.feedbackStatus);
  // 라이브 피드백과 동일 디자인의 상태 배지(STATUS_BADGE 토큰).
  const feedbackBadge = getWrittenFeedbackBadgeVisual(
    mentee.feedbackStatus,
    isAbsent,
  );

  // 최소화 모드: 이름, 희망 직군, 희망 기업, 제출물 보기
  if (collapsed) {
    return (
      <div className="border-neutral-80 flex items-center gap-x-4 gap-y-1 rounded-[4px] border px-4 py-2.5">
        <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-sm font-semibold text-neutral-900">
            {mentee.name}
          </span>
          {mentee.wishJob && (
            <span className="text-xs text-neutral-500">
              희망 직군:{' '}
              <span className="font-medium text-neutral-700">
                {mentee.wishJob}
              </span>
            </span>
          )}
          {mentee.wishCompany && (
            <span className="text-xs text-neutral-500">
              희망 기업:{' '}
              <span className="font-medium text-neutral-700">
                {mentee.wishCompany}
              </span>
            </span>
          )}
          <span className={`text-xs font-medium ${feedbackStatusStyle}`}>
            {feedbackStatusLabel}
          </span>
        </div>
        {hasSubmissionLink ? (
          <span className="flex shrink-0 items-center gap-1">
            <a
              href={mentee.link!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 rounded border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <ExternalLinkIcon size={14} />
              제출물 보기
            </a>
            {canEmbedLink && onViewLinkSide && (
              <SideViewButton
                onClick={onViewLinkSide}
                size={14}
                className="h-[26px] w-[26px]"
              />
            )}
          </span>
        ) : hasExperienceSubmission ? (
          <span className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onViewExperience}
              className="inline-flex shrink-0 items-center gap-1 rounded border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <ExternalLinkIcon size={14} />
              경험 보기
            </button>
            {onViewExperienceSide && (
              <SideViewButton
                onClick={onViewExperienceSide}
                size={14}
                className="h-[26px] w-[26px]"
              />
            )}
          </span>
        ) : isSubmitted ? (
          <span className="shrink-0 text-xs text-neutral-400">제출물 없음</span>
        ) : null}
      </div>
    );
  }

  return (
    <section className={feedbackModalDesign.cardSurface}>
      <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-7">
        {/* 좌: 이름 + 제출 상태 */}
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-lg font-semibold text-neutral-900 md:text-2xl">
              {mentee.name}
            </h3>
            <span className="text-xs font-medium text-neutral-500">
              {challengeTitle ?? ''}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* 제출 상태 */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-neutral-500">제출 상태</span>
              <div className="flex items-center gap-1.5 text-sm">
                <span
                  className={twMerge(
                    feedbackModalDesign.dotBase,
                    isSubmitted
                      ? feedbackModalDesign.dotOk
                      : feedbackModalDesign.dotNone,
                  )}
                />
                <span className="font-medium text-neutral-700">
                  {isSubmitted ? '제출됨' : '미제출'}
                </span>
              </div>
              {hasSubmissionLink ? (
                <span className="flex w-fit items-center gap-1.5">
                  <a
                    href={mentee.link!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    <ExternalLinkIcon />
                    제출물 보기
                  </a>
                  {canEmbedLink && onViewLinkSide && (
                    <SideViewButton
                      onClick={onViewLinkSide}
                      className="h-[34px] w-[34px]"
                    />
                  )}
                </span>
              ) : hasExperienceSubmission ? (
                <span className="flex w-fit items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onViewExperience}
                    className="inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    <ExternalLinkIcon />
                    경험 보기
                  </button>
                  {onViewExperienceSide && (
                    <SideViewButton
                      onClick={onViewExperienceSide}
                      className="h-[34px] w-[34px]"
                    />
                  )}
                </span>
              ) : isSubmitted ? (
                <span className="text-sm text-neutral-400">제출물 없음</span>
              ) : null}
            </div>

            {/* 피드백 상태 — 라이브 피드백과 동일한 배지 디자인(STATUS_BADGE) */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-neutral-500">피드백 상태</span>
              <span className="flex items-center gap-1.5">
                <span
                  className={`rounded-[4px] px-2 py-0.5 text-xs font-medium ${feedbackBadge.badgeClass}`}
                >
                  {feedbackBadge.label}
                </span>
                {isDraftSaved && (
                  <span className="text-xs text-neutral-400">임시저장됨</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* 세로 구분선 — 제출/피드백 상태 ↔ 희망 정보 */}
        <div className={feedbackModalDesign.dividerVertical} />

        {/* 우: 희망 정보 */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="text-xsmall14 flex flex-col gap-2 text-neutral-600">
            {mentee.wishJob ? (
              <div className="flex gap-2">
                <span className="w-16 shrink-0 text-neutral-400">
                  희망 직군
                </span>
                <span>{mentee.wishJob}</span>
              </div>
            ) : null}
            {mentee.wishCompany ? (
              <div className="flex gap-2">
                <span className="w-16 shrink-0 text-neutral-400">
                  희망 기업
                </span>
                <span>{mentee.wishCompany}</span>
              </div>
            ) : null}
            {preQuestion ? (
              <div className="flex gap-2">
                <span className="w-16 shrink-0 text-neutral-400">
                  사전 질문
                </span>
                <span className="whitespace-pre-wrap">{preQuestion}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenteeInfo;
