import { useGetChallengeQuery } from '@/api/program';

/**
 * Determine whether a challenge is classified as B2B.
 * Note: Visibility is implicitly true for items shown on home/category lists.
 */
export default function useIsB2BChallenge(challengeId?: number): boolean {
  const { data } = useGetChallengeQuery({
    challengeId: challengeId as number,
    enabled: Boolean(challengeId),
  });

  const adminList = data?.adminClassificationInfo;
  if (!adminList || adminList.length === 0) return false;
  return adminList.some(
    (info) => info.programAdminClassification === 'B2B',
  );
}


