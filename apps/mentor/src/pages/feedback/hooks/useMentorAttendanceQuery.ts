import {
  isLegacyChallenge,
  useMentorMissionFeedbackAttendanceQuery,
  useMentorMenteeAttendanceQuery,
} from '@/api/challenge/challenge';

export { getMentorAttendanceQueryKey } from '@/api/challenge/challenge';

/**
 * challengeId < 230 (기존 방식)이면 attendance.mentor_id 기반 API를,
 * >= 230 (신규 방식)이면 challenge_application.challenge_mentor_id 기반 API를 호출.
 *
 * 두 훅 모두 항상 호출하되 enabled로 분기 제어 (React hooks 규칙 준수).
 */
export const useMentorAttendanceQuery = ({
  challengeId,
  missionId,
  enabled = true,
}: {
  challengeId?: number | string;
  missionId?: number | string;
  enabled?: boolean;
}) => {
  const isLegacy = challengeId != null && isLegacyChallenge(challengeId);

  const legacyQuery = useMentorMissionFeedbackAttendanceQuery({
    challengeId,
    missionId,
    enabled: isLegacy && enabled,
  });

  const newQuery = useMentorMenteeAttendanceQuery({
    challengeId,
    missionId,
    enabled: !isLegacy && enabled,
  });

  return isLegacy ? legacyQuery : newQuery;
};
