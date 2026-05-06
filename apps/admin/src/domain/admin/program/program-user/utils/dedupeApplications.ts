import type {
  ChallengeApplication,
  GuidebookApplication,
  LiveApplication,
  VodApplication,
} from '@/schema';

/**
 * 동일 application id를 가진 항목이 중복으로 들어온 경우 첫 번째 항목만 남긴다.
 *
 * BE 응답에서 같은 신청자가 (취소 후 재신청 등의 사유로) 여러 번 노출되는 케이스를
 * 어드민 참여자 테이블에서 중복 표시하지 않기 위한 방어 로직.
 */
export function dedupeChallengeApplications(
  list: ChallengeApplication[],
): ChallengeApplication[] {
  const seen = new Set<number>();
  const result: ChallengeApplication[] = [];
  for (const item of list) {
    const id = item.application.id;
    if (seen.has(id)) continue;
    seen.add(id);
    result.push(item);
  }
  return result;
}

type FlatApplication = LiveApplication | GuidebookApplication | VodApplication;

export function dedupeFlatApplications<T extends FlatApplication>(
  list: T[],
): T[] {
  const seen = new Set<number>();
  const result: T[] = [];
  for (const item of list) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
  }
  return result;
}
