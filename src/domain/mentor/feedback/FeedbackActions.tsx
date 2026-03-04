'use client';

import { usePatchAttendanceMentorMutation } from '@/api/mentor/mentor';

interface FeedbackActionsProps {
  attendanceId: number | null;
  editorContent: string;
  missionLink: string | null;
  feedbackStatus: string | null;
  onSaveSuccess: () => void;
  onSubmitSuccess: () => void;
}

const FeedbackActions = ({
  attendanceId,
  editorContent,
  missionLink,
  feedbackStatus,
  onSaveSuccess,
  onSubmitSuccess,
}: FeedbackActionsProps) => {
  const { mutate, isPending } = usePatchAttendanceMentorMutation();

  const isCompleted =
    feedbackStatus === 'COMPLETED' || feedbackStatus === 'CONFIRMED';

  const handleSave = () => {
    if (!attendanceId) return;
    mutate(
      {
        attendanceId,
        feedback: editorContent,
        feedbackStatus: 'IN_PROGRESS',
      },
      {
        onSuccess: () => {
          alert('임시 저장되었습니다.');
          onSaveSuccess();
        },
        onError: () => {
          alert('저장에 실패했습니다.');
        },
      },
    );
  };

  const handleSubmit = () => {
    if (!attendanceId) return;
    const confirmed = window.confirm(
      '최종 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.',
    );
    if (!confirmed) return;

    mutate(
      {
        attendanceId,
        feedback: editorContent,
        feedbackStatus: 'COMPLETED',
      },
      {
        onSuccess: () => {
          alert('최종 제출되었습니다.');
          onSubmitSuccess();
        },
        onError: () => {
          alert('제출에 실패했습니다.');
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
      {/* Left: mission link */}
      <div>
        {missionLink ? (
          <a
            href={missionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            미션 제출물 (노션 링크) &rarr;
          </a>
        ) : (
          <span className="text-sm text-gray-400">제출물 없음</span>
        )}
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || !attendanceId || isCompleted}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          임시 저장
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !attendanceId || isCompleted}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          최종 제출
        </button>
      </div>
    </div>
  );
};

export default FeedbackActions;
