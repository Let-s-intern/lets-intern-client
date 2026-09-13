import type { ChallengeIdPrimitive, ChallengePricePlan } from '@/schema';

export type ChallengeVersion = ChallengeIdPrimitive['versionList'][number];

/**
 * 신청할 때 챌린지 버전을 물어야 하는지 (LC-3247).
 * 버전을 등록한 챌린지만 묻고, LIGHT 플랜은 버전을 고르지 않는다 (설계안 D1).
 */
export const isVersionSelectRequired = (
  versionList: ChallengeVersion[],
  planType: ChallengePricePlan | null | undefined,
) => versionList.length > 0 && planType !== 'LIGHT';
