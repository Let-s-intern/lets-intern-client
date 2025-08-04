/** 참여자별 피드백 페이지 (피드백 작성 페이지) */

import { usePatchAttendance } from '@/api/attendance';
import {
  FeedbackAttendanceQueryKey,
  useFeedbackAttendanceQuery,
} from '@/api/challenge';
import {
  ChallengeMissionFeedbackList,
  FeedbackStatusEnum,
} from '@/api/challengeSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import useBeforeUnloadWarning from '@/hooks/useBeforeUnloadWarning';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import EditorApp from '@components/admin/lexical/EditorApp';
import Heading2 from '@components/admin/ui/heading/Heading2';
import LexicalContent from '@components/common/blog/LexicalContent';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { Button } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AttendanceRow } from './FeedbackParticipantPage';

const useLocalStorageState = () => {
  const [mission, setMission] =
    useState<ChallengeMissionFeedbackList['missionList'][0]>();
  const [attendance, setAttendance] = useState<AttendanceRow>();

  useEffect(() => {
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    setAttendance(attendance);
    const mission = JSON.parse(localStorage.getItem('mission') || '{}');
    setMission(mission);
  }, []);

  return { mission, attendance };
};

const AttendanceInfoList = memo(function AttendanceInfoList() {
  const { mission, attendance } = useLocalStorageState();

  const list = [
    `${attendance?.missionTitle} / ${attendance?.missionRound}회차`,
    `피드백 유형: ${mission?.challengeOptionTitle}`,
    `참여자 정보: ${attendance?.major} / ${attendance?.wishCompany} / ${attendance?.wishJob}`,
    <Link
      key={attendance?.link}
      to={attendance?.link || '#'}
      className="text-primary underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      미션 제출 링크
    </Link>,
  ];

  return (
    <ul className="list-inside list-disc">
      {list.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
});

const useAttendanceFeedback = () => {
  const { programId, missionId, userId } = useParams();

  const { data, isLoading } = useFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    attendanceId: userId,
  });

  const [content, setContent] = useState<string>();

  const hasUnsavedChanges = content !== data?.attendanceDetailVo.feedback;
  const defaultContent = data?.attendanceDetailVo.feedback;

  useEffect(() => {
    if (isLoading || !data) return;
    setContent(data.attendanceDetailVo.feedback ?? undefined);
  }, [isLoading, data]);

  return {
    defaultContent,
    content,
    setContent,
    isLoading: isLoading || !data,
    hasUnsavedChanges,
  };
};

const { COMPLETED, CONFIRMED } = FeedbackStatusEnum.enum;

const useIsCompleted = () => {
  const [isCompleted, setIsCompleted] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const attendance: AttendanceRow = JSON.parse(
      localStorage.getItem('attendance') ?? '{}',
    );

    if (
      attendance.feedbackStatus === COMPLETED ||
      attendance.feedbackStatus === CONFIRMED
    ) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
    setIsLoading(false);
  }, []);

  return { isCompleted, isLoading };
};

const FeedbackEditorApp = ({
  initialEditorStateJsonString,
  onChange,
}: {
  initialEditorStateJsonString?: string;
  onChange?: (jsonString: string) => void;
}) => {
  const { isCompleted, isLoading } = useIsCompleted();

  if (isLoading) return null;

  if (isCompleted && initialEditorStateJsonString) {
    return (
      <div className="my-4 bg-neutral-90 p-5">
        <LexicalContent node={JSON.parse(initialEditorStateJsonString).root} />
      </div>
    );
  }

  return (
    <EditorApp
      initialEditorStateJsonString={initialEditorStateJsonString}
      onChange={onChange}
    />
  );
};

export default function ChallengeFeedbackPage() {
  const navigate = useNavigate();
  const { programId, missionId, userId } = useParams();

  const { snackbar } = useAdminSnackbar();
  const { mutateAsync: patchAttendance } = usePatchAttendance();

  const { content, setContent, isLoading, hasUnsavedChanges, defaultContent } =
    useAttendanceFeedback();
  const { isCompleted } = useIsCompleted();

  const invalidateFeedbackQueries = useInvalidateQueries([
    FeedbackAttendanceQueryKey,
    programId,
    missionId,
    userId,
  ]);

  const { attendance } = useLocalStorageState();

  useBeforeUnloadWarning(hasUnsavedChanges);

  const handleChangeEditor = (jsonString: string) => {
    setContent(jsonString);
  };

  const handleSave = async () => {
    if (!userId) return;
    // TODO: '멘토용 피드백 작성'으로 수정해야 함
    // await patchAttendance({
    //   attendanceId: userId,
    //   feedback: content,
    // });
    await invalidateFeedbackQueries();
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
      `/admin/challenge/operation/${programId}/feedback/mission/${missionId}/participants`,
    );
  };

  if (isLoading) return <LoadingContainer className="mt-[20%]" />;

  return (
    <div className="mt-5 px-5">
      <Heading2 className="mb-2">{attendance?.name} 피드백</Heading2>
      <AttendanceInfoList />
      {!isLoading && (
        <FeedbackEditorApp
          initialEditorStateJsonString={content ?? defaultContent ?? undefined}
          onChange={handleChangeEditor}
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
      <p className="mt-2 text-right text-xsmall14">
        저장 버튼 클릭 후, 피드백 리스트 페이지에서
        <br />
        [진행 상태]를{' '}
        <b className="font-semibold text-system-error">진행완료</b>로 변경해야
        최종 제출됩니다.
      </p>
    </div>
  );
}
