

import BaseModal from '@/common/modal/BaseModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import MentorAlertModal from '@/common/modal/MentorAlertModal';

import FeedbackActions from './ui/FeedbackActions';
import FeedbackEditor from './ui/FeedbackEditor';
import FeedbackHeader from './ui/FeedbackHeader';
import FeedbackLayout from './ui/FeedbackLayout';
import FeedbackMenteeNavigation from './ui/FeedbackMenteeNavigation';
import MenteeInfo from './ui/MenteeInfo';
import MenteeList from './ui/MenteeList';

import { useFeedbackModal } from './hooks/useFeedbackModal';
import { useFeedbackStatus } from './hooks/useFeedbackStatus';
import { useMenteeNavigation } from './hooks/useMenteeNavigation';

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
      className="rounded-2xl md:rounded-3xl mx-2 h-[85vh] w-[1200px] max-w-full overflow-hidden md:mx-4 md:h-[680px]"
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
          <FeedbackMenteeNavigation
            onPrev={handlePrevMentee}
            onNext={handleNextMentee}
            hasPrev={hasPrevMentee}
            hasNext={hasNextMentee}
          />
        }
        navigationCompact={
          <FeedbackMenteeNavigation
            compact
            onPrev={handlePrevMentee}
            onNext={handleNextMentee}
            hasPrev={hasPrevMentee}
            hasNext={hasNextMentee}
          />
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
