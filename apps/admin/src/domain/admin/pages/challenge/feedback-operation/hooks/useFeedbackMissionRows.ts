import {
  useChallengeMissionFeedbackListQuery,
  useMentorMissionFeedbackListQuery,
} from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import { useParams } from 'react-router-dom';
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
