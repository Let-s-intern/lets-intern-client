/**
 * Jitsi 방 URL 생성 유틸.
 *
 * 핵심 원칙:
 * 1. 멘토/멘티/어드민이 **양측 BE 응답 공통 필드**(`feedbackId`)와 공유 `salt`만으로
 *    동일한 방을 합성한다. 시간·이름 등 정규화 차이가 발생할 수 있는 입력은 사용 X.
 * 2. **다른 조직과 방이 우연히 겹치지 않도록** 충분히 식별 가능한 prefix(`letscareer-livefeedback-`)
 *    와 **긴 해시(12자리 base36, ≈ 4.7×10^18 조합)** 를 사용한다.
 *    meet.jit.si는 전 세계 공용 서버라 짧은 방 이름은 외부 충돌 위험이 있다.
 * 3. 외부 라이브러리 없이 djb2 + sdbm 두 해시를 결합해 32-bit 단일 해시 대비
 *    충돌 가능성을 한 차원 더 낮춘다.
 *
 * 포맷:
 *   {baseUrl}letscareer-livefeedback-{12자리 base36}
 */

export interface BuildJitsiRoomUrlInput {
  /** Jitsi 서버 베이스 URL (예: "https://meet.jit.si/") */
  baseUrl: string;
  /** 매칭 식별자 — 멘토/멘티/어드민 BE 응답에서 동일 보장 */
  feedbackId: number;
  /**
   * 환경변수로 주입되는 공유 salt. 충분히 random한 32자 이상 권장.
   * - 양측 멘토/멘티/어드민이 동일 값을 가져야 같은 방으로 수렴
   * - 외부자가 feedbackId만으로 URL을 추측하지 못하게 하는 안전선
   */
  salt: string;
}

/** 방 이름 prefix — 회사명 포함해 외부 조직과의 우연 충돌 회피 */
const ROOM_PREFIX = 'letscareer-livefeedback-';
/** base36 해시 자리수 (36^12 ≈ 4.7×10^18, 충돌·추측 모두 안전) */
const HASH_LENGTH = 12;
/** 결합 해시: 절반은 djb2, 절반은 sdbm */
const HALF_LENGTH = HASH_LENGTH / 2;
const HALF_MOD = 36 ** HALF_LENGTH;
const DJB2_INIT = 5381;

/**
 * djb2 + sdbm 두 해시를 결합해 base36 12자리 문자열 생성.
 * 단일 32-bit 해시의 충돌 가능성을 한 차원 더 낮춘다.
 */
function combinedHash(input: string): string {
  let djb2 = DJB2_INIT;
  let sdbm = 0;
  for (let i = 0; i < input.length; i += 1) {
    const c = input.charCodeAt(i);
    djb2 = ((djb2 << 5) + djb2) ^ c;
    djb2 |= 0;
    sdbm = c + (sdbm << 6) + (sdbm << 16) - sdbm;
    sdbm |= 0;
  }
  const part1 = (Math.abs(djb2) % HALF_MOD)
    .toString(36)
    .padStart(HALF_LENGTH, '0');
  const part2 = (Math.abs(sdbm) % HALF_MOD)
    .toString(36)
    .padStart(HALF_LENGTH, '0');
  return part1 + part2;
}

/**
 * Jitsi 방 이름(인코딩 전)을 생성한다.
 * 디버그/테스트 용도로 내부 노출.
 */
export function buildJitsiRoomName(input: BuildJitsiRoomUrlInput): string {
  // 구분자(`:`)로 입력을 명확히 분리해 salt와 id가 우연히 합쳐지는 충돌 회피
  const hashInput = `${input.salt}:${input.feedbackId}`;
  return `${ROOM_PREFIX}${combinedHash(hashInput)}`;
}

/**
 * Jitsi 방 URL을 생성한다.
 *
 * @example
 *   buildJitsiRoomUrl({
 *     baseUrl: 'https://meet.jit.si/',
 *     feedbackId: 1234,
 *     salt: process.env.NEXT_PUBLIC_JITSI_ROOM_SALT,
 *   });
 *   // → "https://meet.jit.si/letscareer-livefeedback-a3f7b29kd8e1"
 */
export function buildJitsiRoomUrl(input: BuildJitsiRoomUrlInput): string {
  const roomName = buildJitsiRoomName(input);
  const normalizedBase = input.baseUrl.endsWith('/')
    ? input.baseUrl
    : `${input.baseUrl}/`;
  return `${normalizedBase}${roomName}`;
}
