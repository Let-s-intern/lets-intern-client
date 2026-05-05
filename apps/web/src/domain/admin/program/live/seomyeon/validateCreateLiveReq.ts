import type { CreateLiveReq } from '@/schema';

/**
 * PRD-서면라이브 분리 §5.2/§5.3 — 라이브/서면 폼 제출 전 검증.
 *
 * - LIVE: progressType / place / 핵심 필드 모두 필수
 * - SEOMYEON: progressType / place 검증 제외 (폼에서 숨김 + BE는 라이브 동일 엔드포인트)
 *
 * 폼은 react-hook-form/zod resolver를 사용하지 않으므로 onClickSave 직전에
 * 본 함수로 가벼운 가드를 수행. 반환값은 사용자에게 노출할 한국어 에러 메시지 배열.
 * 빈 배열이면 통과.
 */

export type LiveFormVariant = 'LIVE' | 'SEOMYEON';

const COMMON_REQUIRED: ReadonlyArray<{
  key: keyof Omit<CreateLiveReq, 'desc'>;
  label: string;
}> = [
  { key: 'title', label: '제목' },
  { key: 'shortDesc', label: '한 줄 설명' },
];

const LIVE_ONLY_REQUIRED: ReadonlyArray<{
  key: keyof Omit<CreateLiveReq, 'desc'>;
  label: string;
}> = [{ key: 'progressType', label: '온/오프라인 여부' }];

function isEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length === 0;
}

/**
 * 폼 입력 검증.
 * @param input — 폼 state
 * @param variant — 'LIVE' | 'SEOMYEON'
 * @returns 한국어 에러 메시지 배열 (빈 배열 = 통과)
 */
export function validateCreateLiveReq(
  input: Partial<Omit<CreateLiveReq, 'desc'>>,
  variant: LiveFormVariant,
): string[] {
  const errors: string[] = [];

  for (const { key, label } of COMMON_REQUIRED) {
    const value = input[key];
    if (value === undefined || value === null || isEmptyString(value)) {
      errors.push(`${label}을(를) 입력해주세요.`);
    }
  }

  if (variant === 'LIVE') {
    for (const { key, label } of LIVE_ONLY_REQUIRED) {
      const value = input[key];
      if (value === undefined || value === null || isEmptyString(value)) {
        errors.push(`${label}을(를) 입력해주세요.`);
      }
    }
  }

  return errors;
}
