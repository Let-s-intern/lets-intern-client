'use client';

import { useState, type ReactNode } from 'react';

import MenteeInfo from './MenteeInfo';
import FeedbackEditor from './FeedbackEditor';
import FeedbackActions from './FeedbackActions';
import FeedbackHeader from './FeedbackHeader';
import MobileMenteeSelector from './MobileMenteeSelector';

import { useFeedbackModal } from '../hooks/useFeedbackModal';
import { useMenteeNavigation } from '../hooks/useMenteeNavigation';
import { useFeedbackStatus } from '../hooks/useFeedbackStatus';

interface MobileFeedbackPageProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId: number;
  missionId: number;
  challengeTitle?: string;
  missionTh?: number;
}

const MobileFeedbackPage = ({
  isOpen,
  onClose,
  challengeId,
  missionId,
  challengeTitle,
  missionTh,
}: MobileFeedbackPageProps) => {
  const {
    selectedAttendanceId,
    editorContent,
    setEditorContent,
    currentMentee,
    isReadOnly,
    attendanceList,
    handleSelectMentee,
    handleClose,
    handleMutationSuccess,
    editorKey,
  } = useFeedbackModal({ isOpen, onClose, challengeId, missionId });

  const { hasPrevMentee, hasNextMentee, handlePrevMentee, handleNextMentee } =
    useMenteeNavigation({
      attendanceList,
      selectedAttendanceId,
      onSelectMentee: handleSelectMentee,
    });

  const { waitingCount, inProgressCount, completedCount } =
    useFeedbackStatus(attendanceList);

  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen) return null;

  // 크게 보기: 전체 스크롤, 고정 없음
  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
        {/* Header */}
        <FeedbackHeader
          challengeTitle={challengeTitle}
          missionTh={missionTh}
          totalCount={attendanceList.length}
          waitingCount={waitingCount}
          inProgressCount={inProgressCount}
          completedCount={completedCount}
          onClose={handleClose}
        />

        {/* Mentee info - collapsed */}
        <div className="border-b border-gray-100 px-4 py-2">
          <MenteeInfo
            challengeId={challengeId}
            missionId={missionId}
            attendanceId={selectedAttendanceId}
            challengeTitle={challengeTitle}
            collapsed
          />
        </div>

        {/* Editor - grows naturally, no scroll constraint */}
        <div className="px-4 py-3">
          <FeedbackEditor
            key={editorKey}
            initialEditorStateJsonString={editorContent}
            onChange={setEditorContent}
            isReadOnly={isReadOnly}
          />
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          {/* 상단: 작게보기 + 저장/제출 */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 2.5L13.5 2.5L13.5 6M6 13.5L2.5 13.5L2.5 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              작게 보기
            </button>
            <div className="flex-1" />
            <FeedbackActions
              attendanceId={selectedAttendanceId}
              editorContent={editorContent}
              feedbackStatus={currentMentee?.feedbackStatus ?? null}
              onSaveSuccess={handleMutationSuccess}
              onSubmitSuccess={handleMutationSuccess}
            />
          </div>

          {/* 하단: 이전/다음 멘티 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMentee}
              disabled={!hasPrevMentee}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M14 9L10 13L14 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              이전 멘티
            </button>
            <button
              type="button"
              onClick={handleNextMentee}
              disabled={!hasNextMentee}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              다음 멘티
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M10 9L14 13L10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 기본 모드: 기존 레이아웃
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white" style={{ height: '100dvh' }}>
      {/* Header */}
      <FeedbackHeader
        challengeTitle={challengeTitle}
        missionTh={missionTh}
        totalCount={attendanceList.length}
        waitingCount={waitingCount}
        inProgressCount={inProgressCount}
        completedCount={completedCount}
        onClose={handleClose}
      />

      {/* Mentee selector + navigation */}
      <div className="shrink-0 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-2">
          <NavButton
            direction="prev"
            disabled={!hasPrevMentee}
            onClick={handlePrevMentee}
          />
          <div className="flex-1">
            <MobileMenteeSelector
              attendanceList={attendanceList}
              selectedAttendanceId={selectedAttendanceId}
              onSelectMentee={handleSelectMentee}
            />
          </div>
          <NavButton
            direction="next"
            disabled={!hasNextMentee}
            onClick={handleNextMentee}
          />
        </div>
      </div>

      {/* Mentee info - full */}
      <div className="shrink-0 border-b border-gray-100 px-4 py-3">
        <MenteeInfo
          challengeId={challengeId}
          missionId={missionId}
          attendanceId={selectedAttendanceId}
          challengeTitle={challengeTitle}
        />
      </div>

      {/* Scrollable editor area */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3">
        <div className="flex min-h-[240px] flex-1 flex-col">
          <FeedbackEditor
            key={editorKey}
            initialEditorStateJsonString={editorContent}
            onChange={setEditorContent}
            isReadOnly={isReadOnly}
          />
        </div>
      </div>

      {/* Bottom: 크게보기 + 저장/제출 */}
      <div
        className="flex shrink-0 items-center border-t border-gray-200 px-4 py-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2.5 6L2.5 2.5L6 2.5M13.5 10L13.5 13.5L10 13.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          크게 보기
        </button>
        <div className="flex-1" />
        <FeedbackActions
          attendanceId={selectedAttendanceId}
          editorContent={editorContent}
          feedbackStatus={currentMentee?.feedbackStatus ?? null}
          onSaveSuccess={handleMutationSuccess}
          onSubmitSuccess={handleMutationSuccess}
        />
      </div>
    </div>
  );
};

/** Prev/Next navigation button with 44px touch target */
const NavButton = ({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}): ReactNode => {
  const isPrev = direction === 'prev';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-neutral-700 transition-colors disabled:text-neutral-300"
      aria-label={isPrev ? '이전 멘티' : '다음 멘티'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d={isPrev ? 'M14 9L10 13L14 17' : 'M10 9L14 13L10 17'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default MobileFeedbackPage;
