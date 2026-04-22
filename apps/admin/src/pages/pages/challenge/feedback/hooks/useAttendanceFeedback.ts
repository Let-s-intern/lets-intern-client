'use client';

import { useFeedbackAttendanceQuery } from '@/api/challenge/challenge';
// TODO: next/ → react-router-dom 또는 공유 어댑터로 교체 필요 (Vite 이전)
import { useParams } from 'next/navigation';
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
