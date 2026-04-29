import { useFeedbackAttendanceQuery } from '@/api/challenge/challenge';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const useAttendanceFeedback = () => {
  const { programId, missionId, userId } = useParams<{
    programId: string;
    missionId: string;
    userId: string;
  }>();

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

export default useAttendanceFeedback;
