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

export const PROGRAM_TYPE_OPTIONS = ACCESS_LOG_PROGRAM_TYPES.map((value) => ({
  value,
  label: PROGRAM_TYPE_LABEL[value],
}));
