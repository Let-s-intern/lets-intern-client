import { ChallengeIdPrimitive } from '@/schema';
import { ChallengeContent } from '@/types/interface';

/**
 * 챌린지 설명(desc)을 파싱해서 ChallengeContent 객체로 변환해주는 함수
 * 파싱 실패하거나 desc가 없으면 null 반환
 */
export function parseChallengeContent(
  desc: ChallengeIdPrimitive['desc'],
): ChallengeContent | null {
  if (!desc) {
    return null;
  }

  try {
    return JSON.parse(desc) as ChallengeContent;
  } catch {
    return null;
  }
}
