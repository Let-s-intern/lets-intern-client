import { ProgramAdminClassification } from '@/schema';

type AdminClassificationInfo = {
  programAdminClassification: ProgramAdminClassification;
};

type B2BCheckableChallenge = {
  isB2B?: boolean | null;
  adminClassificationInfo?: AdminClassificationInfo[] | null;
};

export function isB2BChallengeFromList(
  challenge: B2BCheckableChallenge,
): boolean {
  if (challenge.isB2B != null) {
    return Boolean(challenge.isB2B);
  }

  const adminList = challenge.adminClassificationInfo;
  return Boolean(
    adminList &&
      adminList.length > 0 &&
      adminList.some((info) => info.programAdminClassification === 'B2B'),
  );
}

/**
 * 챌린지 목록에서 B2C 챌린지만 필터링
 * @param challenges 챌린지 목록 (id와 title을 포함하는 객체 배열)
 * @returns B2C 챌린지 목록
 */
export async function filterB2CChallenges<
  T extends { id: number; title?: string | null } & B2BCheckableChallenge,
>(challenges: T[]): Promise<T[]> {
  if (challenges.length === 0) {
    return [];
  }

  return challenges.filter(
    (challenge) => !isB2BChallengeFromList(challenge),
  );
}
