'use client';

import BaseModal from '@/common/modal/BaseModal';

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
            challengeId={challengeId}
            missionId={missionId}
            selectedAttendanceId={selectedAttendanceId}
            onSelectMentee={handleSelectMentee}
          />
        }
        navigation={
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMentee}
              disabled={!hasPrevMentee}
              className="flex items-center gap-0.5 px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 9L10 13L14 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              이전
            </button>
            <button
              type="button"
              onClick={handleNextMentee}
              disabled={!hasNextMentee}
              className="flex items-center gap-0.5 px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              다음
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
            challengeId={challengeId}
            missionId={missionId}
            attendanceId={selectedAttendanceId}
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
          />
        }
        actions={
          <FeedbackActions
            attendanceId={selectedAttendanceId}
            editorContent={editorContent}
            feedbackStatus={currentMentee?.feedbackStatus ?? null}
            onSaveSuccess={handleMutationSuccess}
            onSubmitSuccess={handleMutationSuccess}
          />
        }
      />
    </BaseModal>
  );
};

export default FeedbackModal;
