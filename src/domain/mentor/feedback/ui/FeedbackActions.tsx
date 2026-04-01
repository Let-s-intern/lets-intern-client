'use client';

import { usePatchAttendanceMentorMutation } from '@/api/mentor/mentor';
import config from '../../constants/config';

interface FeedbackActionsProps {
  attendanceId: number | null;
  editorContent: string;
  feedbackStatus: string | null;
  onSaveSuccess: () => void;
  onSubmitSuccess: () => void;
}

const FeedbackActions = ({
  attendanceId,
  editorContent,
  feedbackStatus,
  onSaveSuccess,
  onSubmitSuccess,
}: FeedbackActionsProps) => {
  const { mutate, isPending } = usePatchAttendanceMentorMutation();

  const isCompleted =
    feedbackStatus === 'COMPLETED' || feedbackStatus === 'CONFIRMED';
  const isDisabled = isPending || !attendanceId || isCompleted;

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
          alert(successMessage);
          onSuccess();
        },
        onError: () => {
          alert(errorMessage);
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
    const isConfirmed = window.confirm(config.feedback.submitConfirm);
    if (!isConfirmed) return;
    submitFeedback(
      'COMPLETED',
      config.feedback.submitSuccess,
      config.feedback.submitFail,
      onSubmitSuccess,
    );
  };

  return (
    <div className="flex justify-end">
      <div className="flex w-full items-center gap-2 md:w-auto md:gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isDisabled}
          className="whitespace-nowrap rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary-5 disabled:cursor-not-allowed disabled:opacity-50 md:px-5 md:py-2"
        >
          저장
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 md:px-5 md:py-2"
        >
          피드백 제출
        </button>
      </div>
    </div>
  );
};

export default FeedbackActions;
