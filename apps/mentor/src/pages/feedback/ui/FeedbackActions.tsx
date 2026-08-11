'use client';

import { usePatchAttendanceMentorMutation } from '@/api/mentor/mentor';
import config from '@/constants/config';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';
import {
  canWriteWrittenFeedback,
  type WrittenSubmissionState,
} from '@/pages/feedback/utils/writtenSubmissionState';

interface FeedbackActionsProps {
  attendanceId: number | null;
  editorContent: string;
  feedbackStatus: string | null;
  /** 제출 상태 — 미제출·지각 제출은 저장·완료를 막는다. */
  submissionState?: WrittenSubmissionState;
  onSaveSuccess: () => void;
  onSubmitSuccess: () => void;
  onAlert: (opts: { title: string; variant: 'success' | 'error' }) => void;
  onConfirm: (opts: {
    title: string;
    description?: string;
    onConfirm: () => void;
  }) => void;
}

const FeedbackActions = ({
  attendanceId,
  editorContent,
  feedbackStatus,
  submissionState = 'submitted',
  onSaveSuccess,
  onSubmitSuccess,
  onAlert,
  onConfirm,
}: FeedbackActionsProps) => {
  const { mutate, isPending } = usePatchAttendanceMentorMutation();

  const isCompleted =
    feedbackStatus === 'COMPLETED' || feedbackStatus === 'CONFIRMED';
  const isDisabled =
    isPending ||
    !attendanceId ||
    isCompleted ||
    !canWriteWrittenFeedback(submissionState);

  const submitFeedback = (
    status: 'IN_PROGRESS' | 'COMPLETED',
    successMessage: string,
    errorMessage: string,
    onSuccess: () => void,
  ) => {
    if (!attendanceId) return;
    mutate(
      { attendanceId, feedback: editorContent, feedbackStatus: status },
      {
        onSuccess: () => {
          onAlert({ title: successMessage, variant: 'success' });
          onSuccess();
        },
        onError: () => {
          onAlert({ title: errorMessage, variant: 'error' });
        },
      },
    );
  };

  const handleSave = () => {
    submitFeedback(
      'IN_PROGRESS',
      config.feedback.saveSuccess,
      config.feedback.saveFail,
      onSaveSuccess,
    );
  };

  const handleSubmit = () => {
    onConfirm({
      title: '피드백을 최종 제출하시겠습니까?',
      description: '제출 후에는 수정할 수 없습니다.',
      onConfirm: () => {
        submitFeedback(
          'COMPLETED',
          config.feedback.submitSuccess,
          config.feedback.submitFail,
          onSubmitSuccess,
        );
      },
    });
  };

  return (
    <div className="flex justify-end">
      <div className="flex w-full items-center gap-2 md:w-auto md:gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isDisabled}
          className={feedbackModalDesign.writtenSaveButton}
        >
          임시저장
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className={feedbackModalDesign.writtenSubmitButton}
        >
          피드백 제출
        </button>
      </div>
    </div>
  );
};

export default FeedbackActions;
