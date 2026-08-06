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
 * 참여자 목록 화면이 **없는** 프로그램 타입 — 참여자 목록 이동 링크를 막는다.
 *
 * 허용 목록이 아니라 차단 목록이다. 허용 목록으로 두면 서버가 타입을 늘렸을 때
 * 멀쩡한 링크가 조용히 사라진다. 차단 목록은 새 타입에 링크가 자동으로 붙고,
 * 그게 옳은 기본값이다. 막는 것은 화면이 없다고 확인된 타입뿐이다.
 *
 * 왜 막나: 참여자 화면이 없는 타입으로 넘어가면 조회가 하나도 켜지지 않아 **빈 목록**이
 * 뜬다. 환불 분쟁 중에 그 화면을 보면 "이 사람은 이용 내역이 없다"로 읽히는데,
 * 화면이 없어서 빈 것과 이용을 안 해서 빈 것이 같은 모양이다. 이 기능이 도우려는
 * 판단에 정확히 반대되는 결론을 유도한다.
 *
 * REPORT 만 막는다 — `pages/pages/program/ProgramUsers.tsx` 를 확인한 결과다.
 * 그 화면은 CHALLENGE·LIVE·VOD·GUIDEBOOK 넷에만 조회를 켜고(`enabled: programType === X`)
 * REPORT 는 타입 자체를 import 하지 않는다. **LIVE 는 화면이 있으므로 막지 않는다** —
 * 적재 대상이 아닌 것과 참여자 화면이 없는 것은 다른 이야기다.
 *
 * 나중에 REPORT 참여자 화면이 생기면 이 목록에서 지우면 된다.
 */
export const PARTICIPANTS_UNSUPPORTED_PROGRAM_TYPES: readonly string[] = [
  'REPORT',
];

export const hasParticipantsPage = (
  programType: string | null | undefined,
): boolean =>
  Boolean(programType) &&
  !PARTICIPANTS_UNSUPPORTED_PROGRAM_TYPES.includes(programType as string);

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
