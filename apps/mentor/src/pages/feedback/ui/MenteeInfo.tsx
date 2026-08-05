'use client';

import { twMerge } from '@/lib/twMerge';

import { type FeedbackStatus } from '@/api/challenge/challengeSchema';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';
import { isNotionUrl } from '../utils/notion';
import { getWrittenFeedbackBadgeVisual } from '../utils/writtenFeedbackStatus';
import {
  canViewSubmission,
  canWriteWrittenFeedback,
  resolveWrittenSubmissionState,
  WRITTEN_SUBMISSION_LABEL,
} from '../utils/writtenSubmissionState';
import MenteeInfoCompactRow from './MenteeInfoCompactRow';
import PanelEntryButton from './PanelEntryButton';
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
  /** 사전 질문을 모달 오른쪽 패널에 띄워 보면서 피드백 작성 */
  onViewPreQuestion?: () => void;
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
  onViewPreQuestion,
}: MenteeInfoProps) => {
  if (!mentee) return EMPTY_STATE;

  const hasPreQuestion = !!preQuestion && preQuestion.trim().length > 0;
  const submissionState = resolveWrittenSubmissionState({
    status: mentee.status,
    attendanceId: mentee.id,
  });
  const isLate = submissionState === 'late';
  // 지각 제출도 제출물은 있다 — 막는 것은 작성이지 열람이 아니다.
  const isSubmitted = canViewSubmission(submissionState);
  const hasSubmissionLink = isSubmitted && !!mentee.link;
  // 노션 링크만 왼쪽 패널 임베드 진입점 노출
  const canEmbedLink = hasSubmissionLink && isNotionUrl(mentee.link);
  // 링크형이 아닌 제출물(경험정리형) → 경험 보기 진입점 노출
  const hasExperienceSubmission =
    isSubmitted && !mentee.link && mentee.userId != null;
  // 임시저장(저장만 하고 미제출)은 서버에서 IN_PROGRESS 로 보관된다 → 라벨에 표시.
  // 지각 제출은 진행 불가이므로 임시저장분이 있어도 "임시저장됨"을 띄우지 않는다(오해 방지).
  const isDraftSaved =
    canWriteWrittenFeedback(submissionState) &&
    mentee.feedbackStatus === 'IN_PROGRESS';
  // 라이브 피드백과 동일 디자인의 상태 배지(STATUS_BADGE 토큰).
  const feedbackBadge = getWrittenFeedbackBadgeVisual(
    mentee.feedbackStatus,
    submissionState,
  );
  // 기본·컴팩트 모드가 같은 표기를 쓰도록 배지를 한 곳에서 만든다.
  // (컴팩트가 별도 어휘·맨텍스트를 쓰던 시절엔 "진행전"이 빨간 글씨로 떠 에러처럼 읽혔다.)
  const statusBadge = (
    <span className="flex shrink-0 items-center gap-1.5">
      <span
        className={`rounded-[4px] px-2 py-0.5 text-xs font-medium ${feedbackBadge.badgeClass}`}
      >
        {feedbackBadge.label}
      </span>
      {isDraftSaved && (
        <span className="text-xs text-neutral-400">임시저장됨</span>
      )}
    </span>
  );

  // 최소화 모드 — 라이브 모달과 같은 컴팩트 행(공통 컴포넌트)을 쓴다.
  if (collapsed) {
    return (
      <MenteeInfoCompactRow
        name={mentee.name}
        wishJob={mentee.wishJob}
        wishCompany={mentee.wishCompany}
        badge={feedbackBadge}
        badgeSuffix={
          isDraftSaved ? (
            <span className="text-xs text-neutral-400">임시저장됨</span>
          ) : null
        }
        actions={
          <>
            {hasSubmissionLink ? (
              <span className="flex shrink-0 items-center gap-1">
                <PanelEntryButton compact href={mentee.link!}>
                  제출물 보기
                </PanelEntryButton>
                {canEmbedLink && onViewLinkSide && (
                  <SideViewButton
                    onClick={onViewLinkSide}
                    size={14}
                    className="h-[30px] w-[30px]"
                  />
                )}
              </span>
            ) : hasExperienceSubmission ? (
              <span className="flex shrink-0 items-center gap-1">
                <PanelEntryButton compact onClick={onViewExperience}>
                  경험 보기
                </PanelEntryButton>
                {onViewExperienceSide && (
                  <SideViewButton
                    onClick={onViewExperienceSide}
                    size={14}
                    className="h-[30px] w-[30px]"
                  />
                )}
              </span>
            ) : isSubmitted ? (
              <span className="shrink-0 text-xs text-neutral-400">
                제출물 없음
              </span>
            ) : null}
            {hasPreQuestion && (
              <PanelEntryButton
                compact
                icon="right-panel"
                onClick={onViewPreQuestion}
              >
                사전 질문 보기
              </PanelEntryButton>
            )}
          </>
        }
      />
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
                    isLate
                      ? feedbackModalDesign.dotAbsent
                      : isSubmitted
                        ? feedbackModalDesign.dotOk
                        : feedbackModalDesign.dotNone,
                  )}
                />
                <span className="font-medium text-neutral-700">
                  {isLate
                    ? WRITTEN_SUBMISSION_LABEL.late
                    : isSubmitted
                      ? '제출됨'
                      : WRITTEN_SUBMISSION_LABEL.notSubmitted}
                </span>
              </div>
              {hasSubmissionLink ? (
                <span className="flex w-fit items-center gap-1.5">
                  <PanelEntryButton href={mentee.link!}>
                    제출물 보기
                  </PanelEntryButton>
                  {canEmbedLink && onViewLinkSide && (
                    <SideViewButton
                      onClick={onViewLinkSide}
                      className="h-[38px] w-[38px]"
                    />
                  )}
                </span>
              ) : hasExperienceSubmission ? (
                <span className="flex w-fit items-center gap-1.5">
                  <PanelEntryButton onClick={onViewExperience}>
                    경험 보기
                  </PanelEntryButton>
                  {onViewExperienceSide && (
                    <SideViewButton
                      onClick={onViewExperienceSide}
                      className="h-[38px] w-[38px]"
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
              {statusBadge}
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
          </div>

          {/* 사전 질문 진입 — 좌측 열의 "경험 보기"와 같은 줄에 놓이도록 하단 정렬 */}
          {hasPreQuestion ? (
            <PanelEntryButton
              icon="right-panel"
              onClick={onViewPreQuestion}
              className="mt-auto"
            >
              사전 질문 보기
            </PanelEntryButton>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default MenteeInfo;
