import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';

/** 정렬 가능한 컬럼 키. */
export type SortKey = 'dateTime' | 'menteeName' | 'createDate';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}

function compareByKey(
  a: FeedbackAdminVo,
  b: FeedbackAdminVo,
  key: SortKey,
): number {
  switch (key) {
    case 'dateTime':
      return a.startDate.localeCompare(b.startDate);
    case 'menteeName':
      return a.menteeName.localeCompare(b.menteeName, 'ko');
    case 'createDate':
      return a.createDate.localeCompare(b.createDate);
  }
}

/** 예약 목록을 정렬한다(원본 불변). */
export function sortReservations(
  list: FeedbackAdminVo[],
  sort: SortState,
): FeedbackAdminVo[] {
  const factor = sort.direction === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => factor * compareByKey(a, b, sort.key));
}

/** 멘티 이름 부분 일치 필터(클라이언트). 빈 검색어면 전체 반환. */
export function filterByMenteeName(
  list: FeedbackAdminVo[],
  menteeName: string,
): FeedbackAdminVo[] {
  const term = menteeName.trim().toLowerCase();
  if (!term) return list;
  return list.filter((item) => item.menteeName.toLowerCase().includes(term));
}
