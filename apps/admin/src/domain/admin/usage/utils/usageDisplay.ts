import {
  ACCESS_LOG_PROGRAM_TYPES,
  ACCESS_LOG_TARGET_TYPES,
  type AccessLogTargetSummary,
  type KnownAccessLogTargetType,
} from '@/api/accessLog';

import { TRACKED_PROGRAM_TYPES } from '../constants/programType';

/**
 * 이용 기록 표시 판정 (LC-3201, PRD 7.4).
 *
 * 이 파일이 하는 일은 "기록이 없다"의 네 가지 이유를 가르는 것이다.
 *
 *   집계 대상 아님 — 애초에 기록하지 않는 프로그램 타입이다. 이용 여부를 말할 수 없다
 *   집계 이전     — 로그 도입 전 결제라 소급이 불가능하다. 이용하지 않았다는 뜻이 아니다
 *   미이용       — 도입 이후 결제인데 이용 기록이 없다. 환불 판단의 근거가 된다
 *   확인 불가     — 판정할 근거 자체가 없다. 없는 것과 못 읽은 것은 다르다
 *
 * 이 구분이 없으면 과거 결제가 전부 `미이용` 으로 보여 운영이 잘못된 전액 환불을 실행한다.
 * 이 기능에서 가장 사고가 나기 쉬운 지점이라 애매하면 언제나 `확인 불가` 로 간다.
 *
 * 여기서 환불 가부를 말하지 않는다. 규정 판단은 운영의 몫이고, 화면이 결론을 내리면
 * 예외 상황에서 잘못된 근거가 된다(PRD 7.3). 이 유틸은 사실만 표현한다.
 */

export type UsageStatus =
  | 'USED'
  | 'NOT_TRACKED'
  | 'BEFORE_TRACKING'
  | 'NOT_USED'
  | 'UNKNOWN';

export const USAGE_STATUS_LABEL: Record<UsageStatus, string> = {
  USED: '이용함',
  NOT_TRACKED: '집계 대상 아님',
  BEFORE_TRACKING: '기록 없음 (집계 이전)',
  NOT_USED: '미이용',
  UNKNOWN: '확인 불가',
};

export interface UsageRecord {
  firstAccessedAt?: string | null;
  paidAt?: string | null;
  /** 집계 시작 시각. 목록 응답 최상위에서 온다. */
  trackedFrom?: string | null;
  /**
   * 프로그램 타입. 적재 대상이 아닌 타입을 가려내는 데 쓴다.
   *
   * 목록 API 가 신청서 기준 left join 이라 LIVE·REPORT 신청서도 행으로 내려오고,
   * 로그가 없으니 `firstAccessedAt` 이 null 이다. 이 값을 넘기지 않으면
   * 적재하지도 않는 건이 `미이용` 으로 표시된다.
   */
  programType?: string | null;
}

/**
 * 시각까지 포함해 비교하기 위해 파싱한다.
 *
 * 문자열 비교에 기대지 않는다. 서버가 형식을 하나만 쓴다는 보장이 없고
 * (`2026-08-06T09:00:00` 과 `2026-08-06T09:00:00.000Z` 가 섞일 수 있다)
 * 자릿수가 다르면 사전순 비교가 조용히 틀린 답을 준다.
 */
const toTime = (value: string | null | undefined): number | null => {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
};

/**
 * 적재 대상이 아닌 프로그램 타입인가.
 *
 * 값을 넘기지 않았으면(`null`·`undefined`) 판단하지 않고 기존 흐름에 맡긴다.
 * 타입 정보 없이 `집계 대상 아님` 이라고 말할 근거가 없다.
 */
const isUntrackedProgramType = (value: string | null | undefined): boolean => {
  if (!value) return false;
  if ((TRACKED_PROGRAM_TYPES as readonly string[]).includes(value)) {
    return false;
  }
  // 아는 타입인데 적재 대상이 아닌 경우만 단정한다(LIVE·REPORT).
  return (ACCESS_LOG_PROGRAM_TYPES as readonly string[]).includes(value);
};

/**
 * 서버가 우리가 모르는 타입을 보냈는가.
 *
 * 새 타입이 적재 대상인지 아닌지 화면은 알 수 없다. `미이용` 으로 떨어뜨리면
 * 기록하지 않는 타입에 전액 환불이 나가고, `집계 대상 아님` 으로 단정하면
 * 실제로 적재되는 타입의 미이용 건을 가린다. 둘 다 틀리므로 판단을 미룬다.
 */
const isUnrecognizedProgramType = (
  value: string | null | undefined,
): boolean => {
  if (!value) return false;
  return !(ACCESS_LOG_PROGRAM_TYPES as readonly string[]).includes(value);
};

/**
 * 이용 기록 판정.
 *
 * 조회 자체가 실패했으면 `null` 을 넘긴다. 읽지 못한 것을 `미이용` 으로 떨어뜨리면
 * 이용한 사람에게 전액 환불이 나간다.
 */
export const resolveUsageStatus = (
  record: UsageRecord | null | undefined,
): UsageStatus => {
  if (!record) return 'UNKNOWN';

  // 최초 이용 시각이 있으면 이용한 것이다. 다만 읽을 수 없는 값이면 단정하지 않는다.
  if (record.firstAccessedAt) {
    return toTime(record.firstAccessedAt) == null ? 'UNKNOWN' : 'USED';
  }

  // 적재 대상이 아닌 타입을 가장 먼저 가른다. 시점 비교보다 앞이어야 한다.
  // LIVE 신청서가 집계 시작 이전 결제면 `집계 이전` 으로 떨어지는데 그것도 틀린 표시다.
  // 이 타입들은 결제 시점과 무관하게 애초에 기록하지 않아 이용 여부를 말할 수 없다.
  if (isUntrackedProgramType(record.programType)) return 'NOT_TRACKED';

  // 모르는 타입은 적재 대상인지 알 수 없다. 어느 쪽으로도 단정하지 않는다.
  if (isUnrecognizedProgramType(record.programType)) return 'UNKNOWN';

  const paidAt = toTime(record.paidAt);
  const trackedFrom = toTime(record.trackedFrom);

  // 둘 중 하나라도 없으면 집계 이전인지 미이용인지 가를 수 없다.
  if (paidAt == null || trackedFrom == null) return 'UNKNOWN';

  // 집계 시작과 결제가 같은 시각이면 집계 대상이다. 경계는 미이용 쪽에 둔다.
  return paidAt < trackedFrom ? 'BEFORE_TRACKING' : 'NOT_USED';
};

export const formatUsageStatus = (
  record: UsageRecord | null | undefined,
): string => USAGE_STATUS_LABEL[resolveUsageStatus(record)];

/** 법정 전액 환불 기간과 같은 값이지만, 이 상수는 강조 대상만 고른다. 가부를 말하지 않는다. */
export const RECENT_WINDOW_DAYS = 7;

/** 목록에서 눈에 띄게 할 행에 붙는 문구. 사실만 적는다. */
export const RECENT_UNUSED_NOTICE = '결제 후 7일 이내 · 이용 기록 없음';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 결제 후 지정 일수 이내이면서 판정이 `미이용` 인가.
 *
 * 기준 시각을 인자로 받는다. 내부에서 `Date.now()` 를 읽으면 테스트가 실제 시계에
 * 의존해 경계값을 검증할 수 없다.
 *
 * 경계는 포함이다 — 정확히 7일째도 `이내` 로 본다. `집계 이전` 과 `확인 불가` 는
 * 미이용이 아니므로 강조하지 않는다. 판정 근거가 없는 행을 강조하면 그 강조가
 * 곧 잘못된 환불 근거가 된다.
 *
 * 결제일이 기준 시각보다 미래이면 강조하지 않는다. 시계 오차나 잘못된 데이터인데,
 * 경과 시간이 음수라 상한만 보면 그대로 통과해 버린다.
 */
export const isRecentUnused = (
  record: UsageRecord | null | undefined,
  now: Date | number,
  days: number = RECENT_WINDOW_DAYS,
): boolean => {
  if (resolveUsageStatus(record) !== 'NOT_USED') return false;

  const paidAt = toTime(record?.paidAt);
  if (paidAt == null) return false;

  const nowTime = now instanceof Date ? now.getTime() : now;
  if (Number.isNaN(nowTime)) return false;

  const elapsed = nowTime - paidAt;

  return elapsed >= 0 && elapsed <= days * DAY_MS;
};

const TARGET_TYPE_LABEL: Record<KnownAccessLogTargetType, string> = {
  CHALLENGE_DASHBOARD: '대시보드',
  MISSION: '미션',
  // 자료를 실제로 연 것이다. 미션 페이지 방문보다 강한 증거라 따로 적는다.
  MISSION_TEMPLATE: '미션 템플릿',
  MISSION_ESSENTIAL_CONTENT: '필수 자료',
  MISSION_ADDITIONAL_CONTENT: '추가 자료',
  PROGRAM: '프로그램',
};

const isKnownTargetType = (value: string): value is KnownAccessLogTargetType =>
  (ACCESS_LOG_TARGET_TYPES as readonly string[]).includes(value);

/** 이용 항목이 하나도 없을 때의 표기. 빈 문자열을 돌려주면 칸이 비어 의미가 반대로 읽힌다. */
export const TARGET_SUMMARY_EMPTY = '없음';

/**
 * 이용 항목 요약 문자열. 예: `대시보드, 미션 3건`
 *
 * `count` 는 접근 횟수가 아니라 구별되는 대상 개수다. 그래서 1건이면 개수를 붙이지 않는다 —
 * `대시보드 1건` 은 한 번 들어갔다는 뜻으로 읽히는데 사실이 아니다. 누적 횟수는 별도 컬럼이다.
 *
 * 모르는 항목도 버리지 않는다. 조용히 사라지면 실제로는 무언가를 이용한 행이
 * `이용 항목 없음` 으로 읽혀 정반대의 결론이 나온다.
 *
 * 반대로 개수가 0 인 항목은 뺀다. 대상이 하나도 없다는 뜻인데 라벨만 남으면
 * 이용한 것처럼 읽힌다. 개수를 아예 모르는 항목(`count` 없음)은 다르다 —
 * 항목이 왔다는 사실은 남았으므로 개수 없이 표시한다.
 */
export const formatTargetSummary = (
  summary: AccessLogTargetSummary[] | null | undefined,
): string => {
  const labels = (summary ?? [])
    .filter((item) => item.count == null || item.count > 0)
    .map((item) => {
      const rawType = item.targetType?.trim();
      const label = !rawType
        ? '기타'
        : isKnownTargetType(rawType)
          ? TARGET_TYPE_LABEL[rawType]
          : `기타(${rawType})`;

      return item.count != null && item.count > 1
        ? `${label} ${item.count}건`
        : label;
    });

  return labels.length ? labels.join(', ') : TARGET_SUMMARY_EMPTY;
};
