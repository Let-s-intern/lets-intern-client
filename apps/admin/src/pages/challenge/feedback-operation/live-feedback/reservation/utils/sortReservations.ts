import {
  rowCreateDate,
  rowMenteeName,
  rowStartDate,
  type ReservationRow,
} from './reservationRow';

/** 정렬 가능한 컬럼 키. */
export type SortKey = 'dateTime' | 'menteeName' | 'createDate';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}

function compareByKey(
  a: ReservationRow,
  b: ReservationRow,
  key: SortKey,
): number {
  switch (key) {
    case 'dateTime':
      // 슬롯을 잡지 못한 1대1 신청은 예약 일시가 없다. 빈 문자열로 두어 오름차순 맨 앞에 모은다.
      return (rowStartDate(a) ?? '').localeCompare(rowStartDate(b) ?? '');
    case 'menteeName':
      return rowMenteeName(a).localeCompare(rowMenteeName(b), 'ko');
    case 'createDate':
      return rowCreateDate(a).localeCompare(rowCreateDate(b));
  }
}

/** 예약 목록을 정렬한다(원본 불변). */
export function sortReservations(
  list: ReservationRow[],
  sort: SortState,
): ReservationRow[] {
  const factor = sort.direction === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => factor * compareByKey(a, b, sort.key));
}

/** 멘티 이름 부분 일치 필터(클라이언트). 빈 검색어면 전체 반환. */
export function filterByMenteeName(
  list: ReservationRow[],
  menteeName: string,
): ReservationRow[] {
  const term = menteeName.trim().toLowerCase();
  if (!term) return list;
  return list.filter((row) => rowMenteeName(row).toLowerCase().includes(term));
}
