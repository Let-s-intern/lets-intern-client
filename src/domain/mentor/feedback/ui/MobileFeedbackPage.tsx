'use client';

import { useState, type ReactNode } from 'react';

import MentorAlertModal from '../../ui/MentorAlertModal';
import { useMentorAlert } from '../../hooks/useMentorAlert';

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
    isAbsent,
    attendanceList,
    handleSelectMentee,
    handleClose,
    handleMutationSuccess,
    editorKey,
    confirmModal,
    handleConfirmResult,
  } = useFeedbackModal({ isOpen, onClose, challengeId, missionId });

  const { hasPrevMentee, hasNextMentee, handlePrevMentee, handleNextMentee } =
    useMenteeNavigation({
      attendanceList,
      selectedAttendanceId,
      onSelectMentee: handleSelectMentee,
    });

  const { waitingCount, inProgressCount, completedCount } =
    useFeedbackStatus(attendanceList);

  const { alertProps, showAlert, showConfirm } = useMentorAlert();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen) return null;

  const editorBlock = (
    <FeedbackEditor
      key={editorKey}
      initialEditorStateJsonString={editorContent}
      onChange={setEditorContent}
      isReadOnly={isReadOnly}
      isAbsent={isAbsent}
    />
  );

  const actionsBlock = (
    <FeedbackActions
      attendanceId={selectedAttendanceId}
      editorContent={editorContent}
      feedbackStatus={currentMentee?.feedbackStatus ?? null}
      isAbsent={isAbsent}
      onSaveSuccess={handleMutationSuccess}
      onSubmitSuccess={handleMutationSuccess}
      onAlert={(opts) => showAlert({ title: opts.title, variant: opts.variant })}
      onConfirm={(opts) =>
        showConfirm({
          title: opts.title,
          description: opts.description,
          onConfirm: opts.onConfirm,
        })
      }
    />
  );

  const modals = (
    <>
      <MentorAlertModal
        isOpen={confirmModal.isOpen}
        onClose={() => handleConfirmResult(false)}
        onConfirm={() => handleConfirmResult(true)}
        title="변경사항이 저장되지 않았습니다"
        description={confirmModal.message}
        confirmText="이동"
        cancelText="취소"
        variant="confirm"
      />
      <MentorAlertModal {...alertProps} />
    </>
  );

  // 크게 보기: 전체 스크롤, 고정 없음
  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
        <FeedbackHeader
          challengeTitle={challengeTitle}
          missionTh={missionTh}
          totalCount={attendanceList.length}
          waitingCount={waitingCount}
          inProgressCount={inProgressCount}
          completedCount={completedCount}
          onClose={handleClose}
        />

        <div className="border-b border-gray-100 px-4 py-2">
          <MenteeInfo
            challengeId={challengeId}
            missionId={missionId}
            attendanceId={selectedAttendanceId}
            challengeTitle={challengeTitle}
            collapsed
          />
        </div>

        <div className="px-4 py-3">
          {editorBlock}
        </div>

        <div
          className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
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
            {actionsBlock}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMentee}
              disabled={!hasPrevMentee}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 py-3.5 text-base font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M14 8L9 13L14 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              이전 멘티
            </button>
            <button
              type="button"
              onClick={handleNextMentee}
              disabled={!hasNextMentee}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 py-3.5 text-base font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              다음 멘티
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M10 8L15 13L10 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {modals}
      </div>
    );
  }

  // 기본 모드
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white" style={{ height: '100dvh' }}>
      <FeedbackHeader
        challengeTitle={challengeTitle}
        missionTh={missionTh}
        totalCount={attendanceList.length}
        waitingCount={waitingCount}
        inProgressCount={inProgressCount}
        completedCount={completedCount}
        onClose={handleClose}
      />

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

      <div className="shrink-0 border-b border-gray-100 px-4 py-3">
        <MenteeInfo
          challengeId={challengeId}
          missionId={missionId}
          attendanceId={selectedAttendanceId}
          challengeTitle={challengeTitle}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3">
        <div className="flex min-h-[240px] flex-1 flex-col">
          {editorBlock}
        </div>
      </div>

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
        {actionsBlock}
      </div>

      {modals}
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
