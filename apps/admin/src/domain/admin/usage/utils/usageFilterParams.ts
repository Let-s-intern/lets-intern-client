import {
  ACCESS_LOG_DEFAULT_SORT,
  ACCESS_LOG_SORTS,
  ACCESS_LOG_USAGE_STATUSES,
  type AccessLogListParams,
  type AccessLogSort,
  type AccessLogUsageStatus,
} from '@/api/accessLog';
import dayjs from '@/lib/dayjs';

import { formatProgramType } from '../constants/programType';
import { USAGE_STATUS_LABEL } from './usageDisplay';

/**
 * 이용 히스토리 필터 상태 (LC-3201, PRD 7.3).
 *
 * 필터를 전부 URL 에 둔다. 새로고침·뒤로가기에 살아남고, 운영이 조건을 그대로 공유할 수 있다.
 * 이 파일은 URL 과 조회 파라미터 사이의 번역만 맡는다 — 화면이 조건을 따로 기억하면
 * 주소창에 보이는 조건과 실제로 걸린 조건이 갈린다.
 */

export interface UsageFilterState {
  programKeyword: string;
  userKeyword: string;
  programType: string;
  paidFrom: string;
  paidTo: string;
  firstAccessedFrom: string;
  firstAccessedTo: string;
  usageStatus: AccessLogUsageStatus | '';
  includeCanceled: boolean;
  sort: AccessLogSort;
}

export type UsageFilterKey = keyof UsageFilterState;

const isUsageStatus = (value: string): value is AccessLogUsageStatus =>
  (ACCESS_LOG_USAGE_STATUSES as readonly string[]).includes(value);

const isSort = (value: string): value is AccessLogSort =>
  (ACCESS_LOG_SORTS as readonly string[]).includes(value);

/**
 * URL 에서 필터를 읽는다.
 *
 * 모르는 값(손으로 고친 주소, 옛 링크)은 조용히 버린다. 그대로 서버에 넘기면 화면은
 * 조건이 걸렸다고 믿는데 서버는 무시하거나 오류를 내고, 그 빈 목록이 "없다"로 읽힌다.
 */
export const readUsageFilters = (
  searchParams: URLSearchParams,
): UsageFilterState => {
  const read = (key: string) => searchParams.get(key)?.trim() ?? '';

  const usageStatus = read('usageStatus');
  const sort = read('sort');

  return {
    programKeyword: read('programKeyword'),
    userKeyword: read('userKeyword'),
    programType: read('programType'),
    paidFrom: read('paidFrom'),
    paidTo: read('paidTo'),
    firstAccessedFrom: read('firstAccessedFrom'),
    firstAccessedTo: read('firstAccessedTo'),
    usageStatus: isUsageStatus(usageStatus) ? usageStatus : '',
    // 취소 건도 분쟁이 이어지므로 기본은 포함이다(PRD 5.5.1).
    includeCanceled: read('includeCanceled') !== 'false',
    sort: isSort(sort) ? sort : ACCESS_LOG_DEFAULT_SORT,
  };
};

/** 빈 문자열은 조건 없음이다. 그대로 보내면 서버가 빈 값으로 거를 수 있다. */
const orUndefined = (value: string) => value || undefined;

export const toAccessLogListParams = (
  filters: UsageFilterState,
  page: number,
  size: number,
): AccessLogListParams => ({
  programKeyword: orUndefined(filters.programKeyword),
  userKeyword: orUndefined(filters.userKeyword),
  programType: orUndefined(filters.programType),
  paidFrom: orUndefined(filters.paidFrom),
  paidTo: orUndefined(filters.paidTo),
  firstAccessedFrom: orUndefined(filters.firstAccessedFrom),
  firstAccessedTo: orUndefined(filters.firstAccessedTo),
  usageStatus: filters.usageStatus || undefined,
  includeCanceled: filters.includeCanceled,
  sort: filters.sort,
  page,
  size,
});

export interface UsageFilterChip {
  key: string;
  label: string;
  /** 해제할 때 비울 필터. 범위는 시작·종료를 함께 지운다. */
  clears: UsageFilterKey[];
}

const rangeLabel = (name: string, from: string, to: string) => {
  if (from && to) return `${name}: ${from} ~ ${to}`;
  if (from) return `${name}: ${from} 이후`;
  return `${name}: ${to} 이전`;
};

/**
 * 지금 걸려 있는 조건을 사람이 읽을 문장으로 편다.
 *
 * 조건이 여럿이면 무엇 때문에 결과가 비었는지 알기 어렵다. 특히 `집계 이전` 을 걸어 둔 채
 * 빈 목록을 보면 "미이용이 없다"로 읽히는데, 정반대의 결론이다.
 *
 * 정렬은 넣지 않는다. 결과를 거르지 않고 순서만 바꾸므로 "해제"라는 말이 성립하지 않는다.
 */
export const describeUsageFilters = (
  filters: UsageFilterState,
): UsageFilterChip[] => {
  const chips: UsageFilterChip[] = [];

  if (filters.programKeyword) {
    chips.push({
      key: 'programKeyword',
      label: `프로그램: ${filters.programKeyword}`,
      clears: ['programKeyword'],
    });
  }
  if (filters.userKeyword) {
    chips.push({
      key: 'userKeyword',
      label: `유저: ${filters.userKeyword}`,
      clears: ['userKeyword'],
    });
  }
  if (filters.programType) {
    chips.push({
      key: 'programType',
      label: `프로그램 타입: ${formatProgramType(filters.programType)}`,
      clears: ['programType'],
    });
  }
  if (filters.paidFrom || filters.paidTo) {
    chips.push({
      key: 'paid',
      label: rangeLabel('결제일', filters.paidFrom, filters.paidTo),
      clears: ['paidFrom', 'paidTo'],
    });
  }
  if (filters.firstAccessedFrom || filters.firstAccessedTo) {
    chips.push({
      key: 'firstAccessed',
      label: rangeLabel(
        '최초 이용일',
        filters.firstAccessedFrom,
        filters.firstAccessedTo,
      ),
      clears: ['firstAccessedFrom', 'firstAccessedTo'],
    });
  }
  if (filters.usageStatus) {
    chips.push({
      key: 'usageStatus',
      label: `이용 상태: ${USAGE_STATUS_LABEL[filters.usageStatus]}`,
      clears: ['usageStatus'],
    });
  }
  if (!filters.includeCanceled) {
    chips.push({
      key: 'includeCanceled',
      label: '취소 건 제외',
      clears: ['includeCanceled'],
    });
  }

  return chips;
};

/**
 * 접어 둔 자리에 걸려 있는 조건이 있는가.
 *
 * 있으면 상세 조건을 펼쳐 둔다. 감춰진 조건이 결과를 바꾸면 운영이 목록을 잘못 읽는다.
 * 정렬도 포함한다 — 결과를 거르지는 않지만 순서가 달라진 이유가 화면에 보여야 한다.
 */
export const hasAdvancedFilter = (filters: UsageFilterState): boolean =>
  Boolean(
    filters.programType ||
    filters.firstAccessedFrom ||
    filters.firstAccessedTo ||
    !filters.includeCanceled ||
    filters.sort !== ACCESS_LOG_DEFAULT_SORT,
  );

/**
 * 오늘로부터 며칠 전의 날짜(`YYYY-MM-DD`).
 *
 * 기준 시각을 인자로 받는다. 안에서 시계를 읽으면 테스트가 실제 날짜에 의존한다.
 */
export const dateDaysAgo = (days: number, now: Date | number = Date.now()) =>
  dayjs(now).subtract(days, 'day').format('YYYY-MM-DD');
