import { useMissionAttendanceUserExperiencesQuery } from '@/api/challenge/challenge';

interface UseMenteeExperiencesParams {
  missionId?: number;
  /** 멘티 목록 항목의 userId (미제출자는 null) */
  userId?: number | null;
  /** 제출 상태가 미제출(ABSENT)인지 여부 */
  isAbsent: boolean;
  /** 링크형 제출물 존재 여부 (링크형이면 경험 조회 불필요) */
  hasLink: boolean;
}

/**
 * 멘티별 경험정리형 제출물(경험 목록)을 조회하는 훅.
 *
 * 경험 조회는 다음 조건을 모두 만족할 때만 수행한다:
 * - 제출됨 (`!isAbsent`)
 * - 링크형이 아님 (`!hasLink`) — 링크형·레거시 챌린지는 기존 외부 링크 동작 유지
 * - `missionId`/`userId` 존재
 *
 * 멘티 전환 시 queryKey(`missionId`, `userId`)가 바뀌어 자동으로 갱신된다.
 */
export function useMenteeExperiencesQuery({
  missionId,
  userId,
  isAbsent,
  hasLink,
}: UseMenteeExperiencesParams) {
  const enabled = !isAbsent && !hasLink && userId != null && missionId != null;

  return useMissionAttendanceUserExperiencesQuery({
    missionId,
    userId: userId ?? undefined,
    enabled,
  });
}
