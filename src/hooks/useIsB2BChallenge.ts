import { useGetChallengeQuery } from '@/api/program';

export default function useIsB2BChallenge(challengeId?: number): boolean {
  const { data } = useGetChallengeQuery({
    challengeId: challengeId as number,
    enabled: Boolean(challengeId),
  });

  const adminList = data?.adminClassificationInfo;
  if (!adminList || adminList.length === 0) return false;
  return adminList.some((info) => info.programAdminClassification === 'B2B');
}
