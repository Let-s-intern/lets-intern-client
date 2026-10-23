import type { ChallengeIdPrimitive, ChallengePricePlan } from '@/schema';

export type ChallengeVersion = ChallengeIdPrimitive['versionList'][number];

/**
 * 신청에 챌린지 버전이 들어가는지 (LC-3247).
 * 버전을 등록한 챌린지만 해당하고, LIGHT 플랜은 버전을 쓰지 않는다 (설계안 D1).
 */
export const isVersionSelectRequired = (
  versionList: ChallengeVersion[],
  planType: ChallengePricePlan | null | undefined,
) => versionList.length > 0 && planType !== 'LIGHT';

/** 신청 입력에 보일 신청 버전명. 버전이 들어가지 않는 신청(LIGHT 등)이면 null */
export const getAppliedVersionTitle = (
  versionList: ChallengeVersion[],
  planType: ChallengePricePlan | null | undefined,
  challengeVersionId: number | null,
) => {
  if (!isVersionSelectRequired(versionList, planType)) return null;
  return (
    versionList.find(
      (version) => version.challengeVersionId === challengeVersionId,
    )?.title ?? null
  );
};
