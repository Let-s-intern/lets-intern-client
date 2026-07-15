import { useMemo, useState } from 'react';

import type {
  FeedbackMentor,
  FeedbackMentorWithAttendance,
} from '@/api/feedback/feedbackSchema';

import { toDateKey } from '../utils/formatReservation';

/** 완료된 예약 테이블에서 정렬 가능한 컬럼. */
export type SortKey = 'datetime' | 'menteeName' | 'createDate';
export type SortDirection = 'asc' | 'desc';

export interface ReservationFilterState {
  /** distinct programTitle 중 선택값. 빈 문자열이면 전체. */
  programTitle: string;
  /** distinct menteeName 중 선택값. 빈 문자열이면 전체. */
  menteeName: string;
  /** 예약 날짜(startDate) 범위 시작. "YYYY-MM-DD" 또는 빈 문자열. */
  reserveFrom: string;
  reserveTo: string;
  /** 신청 날짜(createDate) 범위. "YYYY-MM-DD" 또는 빈 문자열. */
  createFrom: string;
  createTo: string;
}

const INITIAL_FILTERS: ReservationFilterState = {
  programTitle: '',
  menteeName: '',
  reserveFrom: '',
  reserveTo: '',
  createFrom: '',
  createTo: '',
};

/** dateKey가 [from, to] 범위에 드는지. from/to는 빈 문자열이면 무제한. */
function inRange(dateKey: string | null, from: string, to: string): boolean {
  if (dateKey === null) return false;
  if (from && dateKey < from) return false;
  if (to && dateKey > to) return false;
  return true;
}

function matchesFilters(
  item: FeedbackMentor,
  filters: ReservationFilterState,
): boolean {
  if (filters.programTitle && item.programTitle !== filters.programTitle) {
    return false;
  }
  if (filters.menteeName && item.menteeName !== filters.menteeName) {
    return false;
  }
  // 예약 날짜 범위: startDate 기준.
  if (filters.reserveFrom || filters.reserveTo) {
    if (
      !inRange(
        toDateKey(item.startDate),
        filters.reserveFrom,
        filters.reserveTo,
      )
    ) {
      return false;
    }
  }
  // 신청 날짜 범위: createDate 기준. createDate null이면 필터에서 제외.
  if (filters.createFrom || filters.createTo) {
    if (
      !inRange(toDateKey(item.createDate), filters.createFrom, filters.createTo)
    ) {
      return false;
    }
  }
  return true;
}

function compareBy(a: FeedbackMentor, b: FeedbackMentor, key: SortKey): number {
  if (key === 'datetime') return a.startDate.localeCompare(b.startDate);
  if (key === 'menteeName')
    return a.menteeName.localeCompare(b.menteeName, 'ko');
  // createDate: null은 항상 뒤로(가장 작게 취급하되 빈 값은 끝으로 밀기 위해 별도 처리).
  const av = a.createDate ?? '';
  const bv = b.createDate ?? '';
  if (av === bv) return 0;
  if (!av) return 1;
  if (!bv) return -1;
  return av.localeCompare(bv);
}

export interface UseReservationFiltersResult {
  filters: ReservationFilterState;
  setFilter: <K extends keyof ReservationFilterState>(
    key: K,
    value: ReservationFilterState[K],
  ) => void;
  resetFilters: () => void;
  /** 목록의 distinct programTitle (정렬). */
  programTitleOptions: string[];
  /** 목록의 distinct menteeName (정렬). */
  menteeNameOptions: string[];
  /**
   * 필터 적용된 RESERVED 항목(예정), startDate 오름차순.
   * ⚠️ 미제출(attendanceStatus ABSENT/LATE) 건도 status는 여전히 RESERVED이므로 여기 포함된다.
   * (상태 뱃지에서 '미진행'으로 구분 — 누락하지 않는 것이 의도된 정책.)
   */
  reservedList: FeedbackMentorWithAttendance[];
  /** 필터 + 정렬 적용된 COMPLETED 항목(완료). */
  completedList: FeedbackMentorWithAttendance[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  /** 헤더 클릭: 같은 키면 방향 토글, 다른 키면 해당 키 asc. */
  toggleSort: (key: SortKey) => void;
}

/**
 * 예약 현황 필터/정렬/파생 로직.
 *
 * `useFeedbackMentorListWithAttendance()` 결과(목록+상세 attendanceStatus 병합)를 입력으로 받아
 * distinct 옵션·필터·정렬을 모두 useMemo로 파생한다.
 */
export function useReservationFilters(
  data: FeedbackMentorWithAttendance[] | undefined,
): UseReservationFiltersResult {
  const [filters, setFilters] =
    useState<ReservationFilterState>(INITIAL_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>('datetime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const list = useMemo(() => data ?? [], [data]);

  const programTitleOptions = useMemo(
    () =>
      Array.from(new Set(list.map((item) => item.programTitle))).sort((a, b) =>
        a.localeCompare(b, 'ko'),
      ),
    [list],
  );

  const menteeNameOptions = useMemo(
    () =>
      Array.from(new Set(list.map((item) => item.menteeName))).sort((a, b) =>
        a.localeCompare(b, 'ko'),
      ),
    [list],
  );

  const filtered = useMemo(
    () => list.filter((item) => matchesFilters(item, filters)),
    [list, filters],
  );

  const reservedList = useMemo(
    () =>
      filtered
        .filter((item) => item.status === 'RESERVED')
        .slice()
        .sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [filtered],
  );

  const completedList = useMemo(() => {
    const onlyCompleted = filtered.filter(
      (item) => item.status === 'COMPLETED',
    );
    const sorted = onlyCompleted
      .slice()
      .sort((a, b) => compareBy(a, b, sortKey));
    return sortDirection === 'asc' ? sorted : sorted.reverse();
  }, [filtered, sortKey, sortDirection]);

  const setFilter: UseReservationFiltersResult['setFilter'] = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection('asc');
  };

  return {
    filters,
    setFilter,
    resetFilters,
    programTitleOptions,
    menteeNameOptions,
    reservedList,
    completedList,
    sortKey,
    sortDirection,
    toggleSort,
  };
}
