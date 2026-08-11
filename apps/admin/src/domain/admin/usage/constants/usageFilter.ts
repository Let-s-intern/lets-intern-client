import {
  ACCESS_LOG_SORTS,
  ACCESS_LOG_USAGE_STATUSES,
  type AccessLogSort,
} from '@/api/accessLog';

import { USAGE_STATUS_LABEL } from '../utils/usageDisplay';

/**
 * 이용 히스토리 필터 선택지 (LC-3201, PRD 7.3).
 */

/**
 * 이용 상태 선택지.
 *
 * 라벨을 여기서 새로 짓지 않고 판정 유틸의 어휘를 그대로 가져온다. 필터에서 고른 이름과
 * 표에 찍힌 이름이 다르면 운영이 같은 값인지 알 수 없다.
 *
 * **`미이용` 과 `집계 이전` 을 묶은 선택지를 만들지 마라.** "기록 없음" 하나로 합치는 순간
 * 소급이 불가능한 과거 결제가 미이용 목록에 섞이고, 그 목록이 그대로 잘못된 전액 환불의
 * 근거가 된다. 행 단위에서 막아 둔 사고가 필터 단위에서 재현되는 자리다.
 *
 * 적재 대상이 아닌 타입(LIVE·REPORT)은 이 목록에 없다. 프로그램 타입 필터의
 * `(집계 대상 아님)` 라벨이 그 설명을 맡는다.
 */
export const USAGE_STATUS_OPTIONS = ACCESS_LOG_USAGE_STATUSES.map((value) => ({
  value,
  label: USAGE_STATUS_LABEL[value],
}));

export const USAGE_SORT_LABEL: Record<AccessLogSort, string> = {
  LAST_ACCESSED_DESC: '최근 이용순',
  PAID_DESC: '결제일 최신순',
  PAID_ASC: '결제일 오래된순',
};

export const USAGE_SORT_OPTIONS = ACCESS_LOG_SORTS.map((value) => ({
  value,
  label: USAGE_SORT_LABEL[value],
}));

/** 결제일 빠른 선택. 손으로 날짜를 두 번 고르는 일이 가장 잦은 조작이다. */
export const PAID_QUICK_RANGES = [
  { days: 7, label: '7일' },
  { days: 30, label: '30일' },
] as const;

/**
 * 빠른 조회 프리셋 — `결제 7일 이내 · 미이용`.
 *
 * 이 화면이 존재하는 이유인 질의다(PRD 5.5.3). 전용 파라미터를 만들지 않고
 * `paidFrom` + `usageStatus` 조합으로 표현한다. 파라미터를 만들면 "7일"이라는 규정 숫자가
 * 서버에 박혀, 규정이 바뀔 때 배포가 필요하고 운영이 6일·10일로 조정해 볼 수도 없다.
 *
 * 버튼이 채운 값은 필터 입력에 그대로 보여야 한다. 무엇이 적용됐는지 감춘 채 결과만 주면
 * 운영이 그 목록을 신뢰할 근거가 없다.
 */
export const RECENT_UNUSED_PRESET_DAYS = 7;

export const RECENT_UNUSED_PRESET_LABEL = `결제 ${RECENT_UNUSED_PRESET_DAYS}일 이내 · 미이용`;
