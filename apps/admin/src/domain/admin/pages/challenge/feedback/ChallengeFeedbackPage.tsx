/** 참여자별 피드백 페이지 (피드백 작성 페이지) */

import { usePatchAttendanceMentor } from '@/api/attendance/attendance';
import {
  ChallengeMissionFeedbackAttendanceQueryKey,
  FeedbackAttendanceQueryKey,
  MentorMenteeAttendanceQueryKey,
} from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import LoadingContainer from '@/common/loading/LoadingContainer';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import useBeforeUnloadWarning from '@/hooks/useBeforeUnloadWarning';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AttendanceInfoList from './ui/AttendanceInfoList';
import FeedbackEditorApp from './ui/FeedbackEditorApp';
import useAttendanceFeedback from './hooks/useAttendanceFeedback';
import useIsCompleted from './hooks/useIsCompleted';
import useLocalStorageState from './hooks/useLocalStorageState';

export default function ChallengeFeedbackPage() {
  const navigate = useNavigate();
  const { programId, missionId, userId } = useParams<{
    programId: string;
    missionId: string;
    userId: string;
  }>();

  const { snackbar } = useAdminSnackbar();
  const { data: isAdmin } = useIsAdminQuery();
  const queryClient = useQueryClient();
  const { mutateAsync: patchAttendanceMentor } = usePatchAttendanceMentor();

  const { content, setContent, isLoading, hasUnsavedChanges, defaultContent } =
    useAttendanceFeedback();
  const { isCompleted } = useIsCompleted();

  const invalidateFeedbackQueries = useInvalidateQueries([
    FeedbackAttendanceQueryKey,
    programId,
    missionId,
    userId,
  ]);

  const { mission, attendance } = useLocalStorageState();

  useBeforeUnloadWarning(hasUnsavedChanges);

  const handleSave = async () => {
    if (!userId) return;
    await patchAttendanceMentor({
      attendanceId: userId,
      feedback: content,
    });
    await invalidateFeedbackQueries();
    // 목록 쿼리도 invalidate하여 뒤로 갔을 때 상태 반영
    await queryClient.invalidateQueries({
      queryKey: [
        ChallengeMissionFeedbackAttendanceQueryKey,
        programId,
        missionId,
      ],
    });
    await queryClient.invalidateQueries({
      queryKey: [MentorMenteeAttendanceQueryKey, programId, missionId],
    });
    // localStorage 갱신 (useIsCompleted용)
    try {
      const stored = JSON.parse(localStorage.getItem('attendance') ?? '{}');
      if (stored.feedbackStatus === 'WAITING') {
        stored.feedbackStatus = 'IN_PROGRESS';
        localStorage.setItem('attendance', JSON.stringify(stored));
      }
    } catch {
      /* ignore */
    }
    snackbar('저장되었습니다.');
  };

  const handleBackToListWithConfirm = () => {
    if (hasUnsavedChanges) {
      const isConfirm = confirm(
        '작성된 내용이 삭제될 수 있습니다.\n그래도 돌아가시겠습니까?',
      );
      if (!isConfirm) return;
    }
    navigate(
      `/challenge/operation/${programId}/feedback/mission/${missionId}/participants`,
    );
  };

  if (isLoading) return <LoadingContainer className="mt-[20%]" />;

  return (
    <div className="mt-5 px-5">
      {/* 탭 버튼 */}
      <div className="mb-4 flex items-center gap-2">
        {isAdmin && (
          <Link
            to={`/challenge/operation/${programId}/feedback`}
            className="border-neutral-80 text-xsmall14 text-neutral-0 hover:bg-neutral-95 rounded-md border bg-white px-4 py-2 font-medium"
          >
            멘토/멘티 배정
          </Link>
        )}
        <Link
          to={`/challenge/operation/${programId}/feedback`}
          className="border-neutral-80 text-xsmall14 text-neutral-0 hover:bg-neutral-95 rounded-md border bg-white px-4 py-2 font-medium"
        >
          피드백 관리
        </Link>
        <button
          type="button"
          className="border-neutral-80 text-xsmall14 text-neutral-0 hover:bg-neutral-95 rounded-md border bg-white px-4 py-2 font-medium"
          onClick={handleBackToListWithConfirm}
        >
          {mission?.title ?? '미션'} {mission?.th ?? ''}회차 제출현황
        </button>
        <span className="border-neutral-0 bg-neutral-0 text-xsmall14 rounded-md border px-4 py-2 font-medium text-white">
          {attendance?.name} 피드백
        </span>
      </div>

      <Heading2 className="mb-2">{attendance?.name} 피드백</Heading2>
      <AttendanceInfoList />
      {!isLoading && (
        <FeedbackEditorApp
          initialEditorStateJsonString={content || defaultContent || undefined}
          onChange={setContent}
        />
      )}
      <div className="flex items-center justify-end gap-4">
        <Button
          variant="outlined"
          disabled={isCompleted}
          onClick={handleBackToListWithConfirm}
        >
          리스트로 돌아가기
        </Button>
        <Button variant="contained" disabled={isCompleted} onClick={handleSave}>
          저장
        </Button>
      </div>
      <p className="text-xsmall14 mt-2 text-right">
        저장 버튼 클릭 후, 피드백 리스트 페이지에서
        <br />
        [진행 상태]를{' '}
        <b className="text-system-error font-semibold">진행완료</b>로 변경해야
        최종 제출됩니다.
      </p>
    </div>
  );
}
