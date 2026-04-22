import {
  useChallengeMissionFeedbackListQuery,
  useMentorMissionFeedbackListQuery,
} from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
// TODO: next/ → react-router-dom 또는 공유 어댑터로 교체 필요 (Vite 이전)
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import type { Row } from '../types';

const useFeedbackMissionRows = (): Row[] => {
  const { programId } = useParams<{ programId: string }>();
  const { data: isAdmin } = useIsAdminQuery();
  const { data: dataForAdmin } = useChallengeMissionFeedbackListQuery(
    Number(programId),
    { enabled: !!programId && (isAdmin === true) },
  );
  const { data: dataForMentor } = useMentorMissionFeedbackListQuery(
    Number(programId),
    { enabled: !!programId && (isAdmin === false) },
  );

  const data = isAdmin ? dataForAdmin : dataForMentor;

  return useMemo(
    () =>
      (data?.missionList ?? []).map((item) => ({
        ...item,
        url: `/admin/challenge/operation/${programId}/feedback/mission/${item.id}/participants`,
      })),
    [data, programId],
  );
};

export default useFeedbackMissionRows;
