import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';

/**
 * 멘토 이름 → id 인덱스 한 항목.
 * 같은 이름이 2명 이상이면 `ambiguous: true` 로 표시해 폴백을 막는다.
 */
interface MentorNameEntry {
  id: number;
  ambiguous: boolean;
}

/** 멘토 이름 → id 인덱스 (동명이인 감지 포함) */
export type MentorNameIndex = ReadonlyMap<string, MentorNameEntry>;

/** 예약 행의 mentorId 해석 결과 */
export type ResolveMentorIdResult =
  | { mentorId: number; reason: 'api' | 'name-fallback' }
  | { mentorId: null; reason: 'ambiguous' | 'not-found' };

/**
 * 멘토 목록(`{ id, name }`)에서 이름 → id 인덱스를 만든다.
 * 같은 이름이 둘 이상이면 해당 이름은 `ambiguous` 로 표시한다(동명이인 → 폴백 불가).
 */
export function buildMentorNameIndex(
  mentors: ReadonlyArray<{ id: number; name: string }>,
): MentorNameIndex {
  const index = new Map<string, MentorNameEntry>();

  for (const { id, name } of mentors) {
    const existing = index.get(name);
    if (existing) {
      // 이미 같은 이름이 있으면 동명이인 → 폴백 불가로 표시
      existing.ambiguous = true;
    } else {
      index.set(name, { id, ambiguous: false });
    }
  }

  return index;
}

/**
 * 예약 행의 유효 mentorId 를 해석한다.
 *
 * 우선순위:
 * 1. API 응답에 `mentorId` 가 있으면 항상 그 값 사용(BE 배포 시 폴백 자연 소멸).
 * 2. 없으면 멘토 이름이 **정확히 1명** 매칭될 때 그 id 로 폴백.
 * 3. 동명이인(`ambiguous`)·미매칭이면 `mentorId: null` (버튼 비활성).
 *
 * @param row 예약 목록 행
 * @param nameIndex 멘토 이름 → id 인덱스 (없으면 폴백 불가 → not-found)
 */
export function resolveMentorId(
  row: Pick<FeedbackAdminVo, 'mentorId' | 'mentorName'>,
  nameIndex: MentorNameIndex,
): ResolveMentorIdResult {
  if (row.mentorId != null) {
    return { mentorId: row.mentorId, reason: 'api' };
  }

  const entry = nameIndex.get(row.mentorName);
  if (!entry) {
    return { mentorId: null, reason: 'not-found' };
  }
  if (entry.ambiguous) {
    return { mentorId: null, reason: 'ambiguous' };
  }

  return { mentorId: entry.id, reason: 'name-fallback' };
}
