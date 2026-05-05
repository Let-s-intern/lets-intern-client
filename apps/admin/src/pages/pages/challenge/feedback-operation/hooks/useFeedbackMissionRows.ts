import {
  isLegacyChallenge,
  useChallengeMissionFeedbackListQuery,
  useMentorMissionFeedbackListQuery,
} from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import type { Row } from '../types';
import { useLegacyMissionCounts } from './useLegacyMissionCounts';

const useFeedbackMissionRows = (): Row[] => {
  const { programId } = useParams<{ programId: string }>();
  const { data: isAdmin } = useIsAdminQuery();
  const isLegacy = isLegacyChallenge(programId ?? Number.MAX_SAFE_INTEGER);

  const { data: dataForAdmin } = useChallengeMissionFeedbackListQuery(
    Number(programId),
    { enabled: !!programId && isAdmin === true },
  );
  const { data: dataForMentor } = useMentorMissionFeedbackListQuery(
    Number(programId),
    { enabled: !!programId && isAdmin === false },
  );

  const data = isAdmin ? dataForAdmin : dataForMentor;

  // legacy 챌린지는 BE 가 submittedCount/totalCount 를 채워주지 않으므로
  // attendances/prev 를 미션별로 조회해 직접 계산한 값으로 덮어쓴다.
  const legacyCounts = useLegacyMissionCounts({
    challengeId: programId,
    enabled: isLegacy && !!data,
    missionsData: data,
  });

  return useMemo<Row[]>(
    () =>
      (data?.missionList ?? []).map((item) => {
        const counts = isLegacy ? legacyCounts[item.id] : undefined;
        return {
          id: item.id,
          title: item.title,
          th: item.th,
          startDate: item.startDate,
          endDate: item.endDate,
          challengeOptionCode: item.challengeOptionCode,
          challengeOptionTitle: item.challengeOptionTitle,
          challengeOptionType: item.challengeOptionType,
          submittedCount: counts?.submittedCount ?? item.submittedCount,
          totalCount: counts?.totalCount ?? item.totalCount,
          url: `/challenge/operation/${programId}/feedback/mission/${item.id}/participants`,
        };
      }),
    [data, programId, isLegacy, legacyCounts],
  );
};

export default useFeedbackMissionRows;
