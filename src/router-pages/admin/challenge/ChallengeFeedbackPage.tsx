/** 참여자별 피드백 페이지 (피드백 작성 페이지) */

import { usePatchAttendance } from '@/api/attendance';
import { useFeedbackAttendanceQuery } from '@/api/challenge';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import useBeforeUnloadWarning from '@/hooks/useBeforeUnloadWarning';
import EditorApp from '@components/admin/lexical/EditorApp';
import Heading2 from '@components/admin/ui/heading/Heading2';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const { missionTitle, missionRound, major, wishCompany, wishJob, link, name } =
  JSON.parse(localStorage.getItem('attendance')!);

const AttendanceInfoList = () => {
  const { challengeOptionCode } = JSON.parse(localStorage.getItem('mission')!);

  const list = [
    `${missionTitle} / ${missionRound}회차`,
    `피드백 유형: ${challengeOptionCode}`,
    `참여자 정보: ${major} / ${wishCompany} / ${wishJob}`,
    <Link
      key={link}
      to={link}
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
};

export default function ChallengeFeedbackPage() {
  const navigate = useNavigate();
  const { programId, missionId, userId } = useParams();

  const { snackbar } = useAdminSnackbar();
  const patchAttendance = usePatchAttendance();
  const { data } = useFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    attendanceId: userId,
  });

  const [content, setContent] = useState<string>();

  useBeforeUnloadWarning(content !== data?.attendanceDetailVo.feedback);

  const handleChangeEditor = (jsonString: string) => {
    setContent(jsonString);
  };

  const handleSave = async () => {
    if (!userId) return;
    await patchAttendance.mutateAsync({
      attendanceId: userId,
      feedback: content,
    });
    snackbar('저장되었습니다.');
  };

  const handleBackToListWithConfirm = () => {
    if (content !== data?.attendanceDetailVo.feedback) {
      const isConfirm = confirm(
        '작성된 내용이 삭제될 수 있습니다.\n그래도 돌아가시겠습니까?',
      );
      if (!isConfirm) return;
    }
    navigate(
      `/admin/challenge/operation/${programId}/feedback/mission/${missionId}/participants`,
    );
  };

  useEffect(() => {
    setContent(data?.attendanceDetailVo.feedback || undefined);
  }, [data]);

  return (
    <div className="mt-5 px-5">
      <Heading2 className="mb-2">{name} 피드백</Heading2>
      <AttendanceInfoList />
      <EditorApp
        initialEditorStateJsonString={content}
        onChange={handleChangeEditor}
      />
      <div className="flex items-center justify-end gap-4">
        <Button variant="outlined" onClick={handleBackToListWithConfirm}>
          리스트로 돌아가기
        </Button>
        <Button variant="contained" onClick={handleSave}>
          저장
        </Button>
      </div>
    </div>
  );
}
