'use client';

import BaseModal from '@/common/modal/BaseModal';
import MentorAlertModal from '../ui/MentorAlertModal';
import { useMentorAlert } from '../hooks/useMentorAlert';

import MenteeList from './ui/MenteeList';
import MenteeInfo from './ui/MenteeInfo';
import FeedbackEditor from './ui/FeedbackEditor';
import FeedbackActions from './ui/FeedbackActions';
import FeedbackHeader from './ui/FeedbackHeader';
import FeedbackLayout from './ui/FeedbackLayout';

import { useFeedbackModal } from './hooks/useFeedbackModal';
import { useMenteeNavigation } from './hooks/useMenteeNavigation';
import { useFeedbackStatus } from './hooks/useFeedbackStatus';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId: number;
  missionId: number;
  challengeTitle?: string;
  missionTh?: number;
}

const FeedbackModal = ({
  isOpen,
  onClose,
  challengeId,
  missionId,
  challengeTitle,
  missionTh,
}: FeedbackModalProps) => {
  const {
    selectedIndex,
    selectedAttendanceId,
    editorContent,
    setEditorContent,
    currentMentee,
    isReadOnly,
    isAbsent,
    attendanceList,
    handleSelectByIndex,
    handleClose,
    handleMutationSuccess,
    editorKey,
    confirmModal,
    handleConfirmResult,
  } = useFeedbackModal({ isOpen, onClose, challengeId, missionId });

  const { hasPrevMentee, hasNextMentee, handlePrevMentee, handleNextMentee } =
    useMenteeNavigation({
      listLength: attendanceList.length,
      selectedIndex,
      onSelectByIndex: handleSelectByIndex,
    });

  const { waitingCount, inProgressCount, completedCount } =
    useFeedbackStatus(attendanceList);

  const { alertProps, showAlert, showConfirm } = useMentorAlert();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      className="mx-2 h-[85vh] w-[1200px] max-w-full overflow-hidden rounded-2xl md:mx-4 md:h-[680px] md:rounded-3xl"
    >
      <FeedbackHeader
        challengeTitle={challengeTitle}
        missionTh={missionTh}
        totalCount={attendanceList.length}
        waitingCount={waitingCount}
        inProgressCount={inProgressCount}
        completedCount={completedCount}
        onClose={handleClose}
      />

      <FeedbackLayout
        sidebar={
          <MenteeList
            attendanceList={attendanceList}
            selectedIndex={selectedIndex}
            onSelectByIndex={handleSelectByIndex}
          />
        }
        navigation={
          <div className="flex items-center justify-between py-2">
            <button
              type="button"
              onClick={handlePrevMentee}
              disabled={!hasPrevMentee}
              className="flex items-center gap-1 px-4 py-2 text-base font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 9L10 13L14 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              이전 멘티
            </button>
            <button
              type="button"
              onClick={handleNextMentee}
              disabled={!hasNextMentee}
              className="flex items-center gap-1 px-4 py-2 text-base font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음 멘티
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 9L14 13L10 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        }
        navigationCompact={
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMentee}
              disabled={!hasPrevMentee}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 9L10 13L14 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              이전 멘티
            </button>
            <button
              type="button"
              onClick={handleNextMentee}
              disabled={!hasNextMentee}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              다음 멘티
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 9L14 13L10 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        }
        menteeInfo={(collapsed) => (
          <MenteeInfo
            mentee={currentMentee}
            challengeTitle={challengeTitle}
            collapsed={collapsed}
          />
        )}
        editor={
          <FeedbackEditor
            key={editorKey}
            initialEditorStateJsonString={editorContent}
            onChange={setEditorContent}
            isReadOnly={isReadOnly}
            isAbsent={isAbsent}
          />
        }
        actions={
          <FeedbackActions
            attendanceId={selectedAttendanceId}
            editorContent={editorContent}
            feedbackStatus={currentMentee?.feedbackStatus ?? null}
            isAbsent={isAbsent}
            onSaveSuccess={handleMutationSuccess}
            onSubmitSuccess={handleMutationSuccess}
            onAlert={(opts) =>
              showAlert({ title: opts.title, variant: opts.variant })
            }
            onConfirm={(opts) =>
              showConfirm({
                title: opts.title,
                description: opts.description,
                onConfirm: opts.onConfirm,
              })
            }
          />
        }
      />

      {/* Dirty-check confirm modal */}
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

      {/* Alert/Confirm modal for save/submit */}
      <MentorAlertModal {...alertProps} />
    </BaseModal>
  );
};

export default FeedbackModal;
