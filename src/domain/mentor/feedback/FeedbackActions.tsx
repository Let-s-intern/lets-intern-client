'use client';

import { usePatchAttendanceMentorMutation } from '@/api/mentor/mentor';

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
    submitFeedback('IN_PROGRESS', '임시 저장되었습니다.', '저장에 실패했습니다.', onSaveSuccess);
  };

  const handleSubmit = () => {
    const isConfirmed = window.confirm(
      '최종 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.',
    );
    if (!isConfirmed) return;
    submitFeedback('COMPLETED', '최종 제출되었습니다.', '제출에 실패했습니다.', onSubmitSuccess);
  };

  return (
    <div className="flex justify-end border-t pt-2.5">
      <div className="flex w-72 items-center gap-5">
        <button
          type="button"
          onClick={handleSave}
          disabled={isDisabled}
          className="flex-1 rounded border border-primary px-3 py-2 text-base font-medium text-primary transition-colors hover:bg-primary-5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          임시저장
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="flex-1 rounded-md bg-primary px-4 py-2 text-base font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          피드백 제출
        </button>
      </div>
    </div>
  );
};

export default FeedbackActions;
