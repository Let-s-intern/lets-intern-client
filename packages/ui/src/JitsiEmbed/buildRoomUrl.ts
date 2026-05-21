/**
 * Jitsi 방 URL 생성 유틸.
 *
 * PRD §5 방 이름 생성 규칙에 따라 매칭별 고유한 회의실 URL을 만든다.
 *
 * 포맷:
 *   {챌린지명}-{미션명}-{멘티명}-{YYYYMMDD-HHmm}-{shortHash}
 *
 * - 공백/`?` `#` `/` `:` 등 URL slug 호환성을 해치는 문자를 제거한다.
 * - 80자 초과 시 챌린지명 → 미션명 순으로 잘라낸다.
 * - shortHash(4자리 base36)는 5개 입력(챌린지/미션/멘티/시작시간/feedbackId) 기반.
 *   외부 라이브러리 없이 djb2 변형으로 직접 계산한다.
 * - 최종적으로 `encodeURIComponent`로 인코딩해 baseUrl에 이어 붙인다.
 */

export interface BuildJitsiRoomUrlInput {
  /** Jitsi 서버 베이스 URL (예: "https://meet.jit.si/") */
  baseUrl: string;
  /** 챌린지 이름 (예: "취준생을 위한 AI 활용 챌린지") */
  challengeName: string;
  /** 미션 이름 (예: "1주차 자소서 피드백") */
  missionName: string;
  /** 멘티 이름 (예: "홍길동") */
  menteeName: string;
  /** 피드백 입장 시간 (ISO 또는 Date 가능한 문자열) */
  startDate: string;
  /** 매칭 식별자 — 입력이 같아도 매칭이 다르면 다른 방으로 분리하는 안전벨트 */
  feedbackId: number;
}

/** PRD §5.3: 최대 길이 80자 (Jitsi 안정 영역) */
const MAX_ROOM_NAME_LENGTH = 80;
/** PRD §5.2: shortHash 자리수 (base36) */
const SHORT_HASH_LENGTH = 4;
/** djb2 해시 시작값 */
const DJB2_INIT = 5381;
/** base36 modulus (4자리 = 36^4 = 1_679_616) */
const SHORT_HASH_MOD = 36 ** SHORT_HASH_LENGTH;
/** slug에서 제거할 특수문자 */
const STRIP_CHARS_REGEXP = /[\s/?#:]+/g;

/**
 * 외부 의존성 없는 결정론적 해시.
 * djb2 변형: `hash * 33 ^ char`. 32-bit 안전 범위 내에서 동작.
 */
function djb2Hash(input: string): number {
  let hash = DJB2_INIT;
  for (let i = 0; i < input.length; i += 1) {
    // (hash * 33) ^ char — 32-bit 정수로 강제
    hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
    hash |= 0;
  }
  // 부호 제거 후 4자리 base36 단축
  return Math.abs(hash) % SHORT_HASH_MOD;
}

/** 4자리 base36 short hash 문자열 (앞 0 패딩) */
function toShortHash(input: string): string {
  return djb2Hash(input).toString(36).padStart(SHORT_HASH_LENGTH, '0');
}

/** URL slug 안전화 — 공백/특수문자 제거. 한국어는 보존. */
function normalizeSegment(segment: string): string {
  return segment.replace(STRIP_CHARS_REGEXP, '');
}

/** Date를 `YYYYMMDD-HHmm` 형식으로 포맷 (로컬 시간 기준) */
function formatStartDate(startDate: string): string {
  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) {
    return 'invaliddate';
  }
  const pad = (value: number, length = 2) =>
    value.toString().padStart(length, '0');
  const yyyy = date.getFullYear().toString();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}${mm}${dd}-${hh}${min}`;
}

/**
 * 챌린지명/미션명을 우선순위에 따라 잘라 80자 안에 맞춘다.
 * fixed = 멘티명 + 날짜 + 해시 + 구분자 — 절대 자르지 않는다.
 * 챌린지명 → 미션명 순으로 잘라낸다.
 */
function fitWithinLimit(
  challenge: string,
  mission: string,
  fixedTail: string,
): { challenge: string; mission: string } {
  // 전체 = challenge + '-' + mission + '-' + fixedTail
  const separatorBudget = 2; // challenge-mission 사이 '-' 1개 + mission-tail 사이 '-' 1개
  const budgetForVariable =
    MAX_ROOM_NAME_LENGTH - fixedTail.length - separatorBudget;

  if (budgetForVariable <= 0) {
    // 비정상 입력: 변수 영역을 완전히 잘라낸다
    return { challenge: '', mission: '' };
  }

  if (challenge.length + mission.length <= budgetForVariable) {
    return { challenge, mission };
  }

  // 1단계: 챌린지명을 줄여 본다 (미션명은 유지)
  let nextChallenge = challenge;
  let nextMission = mission;
  if (nextMission.length <= budgetForVariable) {
    nextChallenge = nextChallenge.slice(0, budgetForVariable - nextMission.length);
    return { challenge: nextChallenge, mission: nextMission };
  }

  // 2단계: 미션명까지 줄여야 하는 경우 — 챌린지명을 0으로 만들고 미션명을 자른다
  nextChallenge = '';
  nextMission = nextMission.slice(0, budgetForVariable);
  return { challenge: nextChallenge, mission: nextMission };
}

/**
 * Jitsi 방 이름(인코딩 전)을 생성한다.
 * 디버그/테스트 용도로 내부 노출.
 */
export function buildJitsiRoomName(input: BuildJitsiRoomUrlInput): string {
  const challengeRaw = normalizeSegment(input.challengeName);
  const missionRaw = normalizeSegment(input.missionName);
  const menteeRaw = normalizeSegment(input.menteeName);
  const dateToken = formatStartDate(input.startDate);

  // shortHash는 정규화 전/후 어느 쪽으로 만들어도 입력이 같으면 결과가 같다.
  // 정규화 후 문자열 + feedbackId로 계산하면 시각적 입력 변화(공백 추가 등)에도 안정적.
  const hashInput = `${challengeRaw}|${missionRaw}|${menteeRaw}|${dateToken}|${input.feedbackId}`;
  const shortHash = toShortHash(hashInput);

  // fixed tail = "{mentee}-{date}-{shortHash}"
  const fixedTail = `${menteeRaw}-${dateToken}-${shortHash}`;
  const { challenge, mission } = fitWithinLimit(
    challengeRaw,
    missionRaw,
    fixedTail,
  );

  // 빈 segment는 연속 '-' 회피
  const segments = [challenge, mission, menteeRaw, dateToken, shortHash].filter(
    (s) => s.length > 0,
  );
  return segments.join('-');
}

/**
 * Jitsi 방 URL을 생성한다.
 *
 * @example
 *   buildJitsiRoomUrl({
 *     baseUrl: 'https://meet.jit.si/',
 *     challengeName: '취준생을 위한 AI 활용 챌린지',
 *     missionName: '1주차 자소서 피드백',
 *     menteeName: '홍길동',
 *     startDate: '2026-05-21T19:00:00+09:00',
 *     feedbackId: 1234,
 *   });
 *   // → "https://meet.jit.si/%EC%B7%A8%EC%A4%80...-3f7a"
 */
export function buildJitsiRoomUrl(input: BuildJitsiRoomUrlInput): string {
  const roomName = buildJitsiRoomName(input);
  // baseUrl이 슬래시로 끝나지 않을 가능성 대비
  const normalizedBase = input.baseUrl.endsWith('/')
    ? input.baseUrl
    : `${input.baseUrl}/`;
  return `${normalizedBase}${encodeURIComponent(roomName)}`;
}
