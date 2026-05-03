'use client';

import { usePatchAttendanceMentorMutation } from '@/api/mentor/mentor';
import config from '@/constants/config';

interface FeedbackActionsProps {
  attendanceId: number | null;
  editorContent: string;
  feedbackStatus: string | null;
  isAbsent?: boolean;
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
  isAbsent = false,
  onSaveSuccess,
  onSubmitSuccess,
  onAlert,
  onConfirm,
}: FeedbackActionsProps) => {
  const { mutate, isPending } = usePatchAttendanceMentorMutation();

  const isCompleted =
    feedbackStatus === 'COMPLETED' || feedbackStatus === 'CONFIRMED';
  const isDisabled = isPending || !attendanceId || isCompleted || isAbsent;

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
          className="border-primary text-primary hover:bg-primary-5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:px-5 md:py-2"
        >
          저장
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="bg-primary hover:bg-primary-hover whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:px-5 md:py-2"
        >
          피드백 제출
        </button>
      </div>
    </div>
  );
};

export default FeedbackActions;
