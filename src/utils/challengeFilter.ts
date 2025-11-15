import { getChallengeIdSchema } from '@/schema';
import axios from '@/utils/axios';

/**
 * 챌린지 ID로 상세 정보를 조회하여 B2B 챌린지인지 확인
 * @param challengeId 챌린지 ID
 * @returns B2B 챌린지 여부 (true: B2B, false: B2C 또는 에러 발생 시)
 */
export async function isB2BChallenge(challengeId: number): Promise<boolean> {
  try {
    const res = await axios.get(`/challenge/${challengeId}`);
    const challengeData = getChallengeIdSchema.parse(res.data.data);

    const adminList = challengeData.adminClassificationInfo;
    const isB2B = Boolean(
      adminList &&
        adminList.length > 0 &&
        adminList.some((info) => info.programAdminClassification === 'B2B'),
    );

    return isB2B;
  } catch {
    // 에러 발생 시 B2B가 아닌 것으로 간주 (안전하게 처리)
    return false;
  }
}

/**
 * 챌린지 목록에서 B2C 챌린지만 필터링
 * @param challenges 챌린지 목록 (id와 title을 포함하는 객체 배열)
 * @returns B2C 챌린지 목록
 */
export async function filterB2CChallenges<
  T extends { id: number; title?: string | null },
>(challenges: T[]): Promise<T[]> {
  if (challenges.length === 0) {
    return [];
  }

  const b2cChallenges: T[] = [];

  // 순차적으로 각 챌린지의 B2B 여부 확인
  for (const challenge of challenges) {
    const isB2B = await isB2BChallenge(challenge.id);
    if (!isB2B) {
      b2cChallenges.push(challenge);
    }
  }

  return b2cChallenges;
}
