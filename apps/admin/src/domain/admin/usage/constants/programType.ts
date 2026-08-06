import {
  ACCESS_LOG_PROGRAM_TYPES,
  type KnownAccessLogProgramType,
} from '@/api/accessLog';

/**
 * 이용 히스토리에서 쓰는 프로그램 타입 표기 (LC-3201).
 *
 * 목록의 프로그램 컬럼과 상단 필터가 같은 라벨을 써야 한다. 두 곳에 따로 적으면
 * 필터에서 고른 이름과 표에 찍힌 이름이 달라 같은 값인지 알 수 없게 된다.
 */
export const PROGRAM_TYPE_LABEL: Record<KnownAccessLogProgramType, string> = {
  CHALLENGE: '챌린지',
  LIVE: '라이브',
  VOD: 'VOD',
  REPORT: '서류진단',
  GUIDEBOOK: '가이드북',
};

/**
 * 모르는 타입은 서버가 준 값을 그대로 보여준다.
 * 빈칸으로 두면 프로그램이 없는 행처럼 읽힌다.
 */
export const formatProgramType = (value: string | null | undefined): string => {
  if (!value) return '';
  return PROGRAM_TYPE_LABEL[value as KnownAccessLogProgramType] ?? value;
};

/**
 * 이용 로그를 남기는 프로그램 타입 (PRD 5.2, 결정 2026-08-06).
 *
 * LIVE·REPORT 는 이용 시점의 정의가 나머지와 달라 적재 범위에서 빠졌다.
 * 라이브는 미참여자가 많고 리포트는 제출과 수령 시점이 갈린다.
 */
export const TRACKED_PROGRAM_TYPES: readonly KnownAccessLogProgramType[] = [
  'CHALLENGE',
  'VOD',
  'GUIDEBOOK',
];

export const UNTRACKED_PROGRAM_SUFFIX = ' (집계 대상 아님)';

/**
 * 적재 범위 밖 타입도 선택지에서 빼지 않고 그 사실을 라벨에 적는다.
 *
 * 빼 버리면 "라이브는 왜 없지"라는 질문이 남고, 그대로 두면 골랐을 때 0건이 나와
 * `라이브를 이용한 사람이 없다` 로 읽힌다. 실제로는 애초에 기록하지 않는 타입이라
 * 이용 여부를 말할 수 없는 것이다. 없는 것과 안 본 것은 다르다(PRD 7.4).
 *
 * 이 구분을 흐리면 운영이 빈 목록을 근거로 잘못된 전액 환불을 실행한다.
 */
export const PROGRAM_TYPE_OPTIONS = ACCESS_LOG_PROGRAM_TYPES.map((value) => ({
  value,
  label: TRACKED_PROGRAM_TYPES.includes(value)
    ? PROGRAM_TYPE_LABEL[value]
    : `${PROGRAM_TYPE_LABEL[value]}${UNTRACKED_PROGRAM_SUFFIX}`,
}));
