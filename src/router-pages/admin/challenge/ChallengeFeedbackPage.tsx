/** 참여자별 피드백 페이지 (피드백 작성 페이지) */

import { usePatchAttendance } from '@/api/attendance';
import { useFeedbackAttendenceQuery } from '@/api/challenge';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import EditorApp from '@components/admin/lexical/EditorApp';
import Heading2 from '@components/admin/ui/heading/Heading2';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function ChallengeFeedbackPage() {
  const navigate = useNavigate();
  const { programId, missionId, userId, ...rest } = useParams();

  const { snackbar } = useAdminSnackbar();
  const patchAttendance = usePatchAttendance();
  const { data } = useFeedbackAttendenceQuery({
    challengeId: programId,
    missionId,
    attendanceId: userId,
  });

  const {
    missionTitle,
    missionRound,
    major,
    wishCompany,
    wishJob,
    link,
    name,
  } = JSON.parse(localStorage.getItem('attendance')!);
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

  const [content, setContent] = useState<string>();

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

  useEffect(() => {
    setContent(data?.attendanceDetailVo.feedback || undefined);
  }, [data]);

  return (
    <div className="mt-5 px-5">
      <Heading2 className="mb-2">{name} 피드백</Heading2>
      <ul className="list-inside list-disc">
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <EditorApp
        initialEditorStateJsonString={content}
        onChange={handleChangeEditor}
      />
      <div className="flex items-center justify-end gap-4">
        <Button
          variant="outlined"
          onClick={() =>
            navigate(
              `/admin/challenge/operation/${programId}/feedback/mission/${missionId}/participants`,
            )
          }
        >
          리스트로 돌아가기
        </Button>
        <Button variant="contained" onClick={handleSave}>
          저장
        </Button>
      </div>
    </div>
  );
}
