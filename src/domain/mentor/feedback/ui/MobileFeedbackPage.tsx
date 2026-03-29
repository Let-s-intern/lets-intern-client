'use client';

import type { ReactNode } from 'react';

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
  } = useFeedbackModal({ isOpen, onClose, challengeId, missionId });

  const { hasPrevMentee, hasNextMentee, handlePrevMentee, handleNextMentee } =
    useMenteeNavigation({
      attendanceList,
      selectedAttendanceId,
      onSelectMentee: handleSelectMentee,
    });

  const { waitingCount, inProgressCount, completedCount } =
    useFeedbackStatus(attendanceList);

  if (!isOpen) return null;

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

      {/* Mentee info - always visible */}
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
            initialEditorStateJsonString={editorContent}
            onChange={setEditorContent}
            isReadOnly={isReadOnly}
          />
        </div>
      </div>

      {/* Sticky bottom actions with safe-area-inset */}
      <div
        className="shrink-0 bg-white px-4"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
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
