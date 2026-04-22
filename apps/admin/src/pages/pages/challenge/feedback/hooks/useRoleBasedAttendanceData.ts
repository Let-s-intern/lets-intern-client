'use client';

import { useChallengeMissionFeedbackAttendanceQuery } from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import { useMentorAttendanceQuery } from '@/domain/mentor/feedback/hooks/useMentorAttendanceQuery';
// TODO: next/ → react-router-dom 또는 공유 어댑터로 교체 필요 (Vite 이전)
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const useRoleBasedAttendanceData = () => {
  const { missionId, programId } = useParams<{
    missionId: string;
    programId: string;
  }>();

  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdminQuery();

  const { data: dataForAdmin } = useChallengeMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    enabled: !!programId && !!missionId && isAdmin === true,
  });

  const { data: dataForMentor } = useMentorAttendanceQuery({
    challengeId: programId,
    missionId,
    enabled: !!programId && !!missionId && isAdmin === false,
  });

  // mentee API returns id=null for non-submitters — assign synthetic negative IDs
  // so DataGrid (which requires unique row IDs) can render them.
  const mentorData = useMemo(() => {
    if (!dataForMentor) return dataForMentor;
    let syntheticIdCounter = -1;
    return {
      attendanceList: dataForMentor.attendanceList.map((item) => ({
        ...item,
        id: item.id ?? syntheticIdCounter--,
      })),
    };
  }, [dataForMentor]);

  return {
    isLoading: isAdminLoading,
    data: isAdmin === true ? dataForAdmin : mentorData,
  };
};

export default useRoleBasedAttendanceData;
