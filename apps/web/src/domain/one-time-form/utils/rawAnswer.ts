import type { OneTimeFormAttachmentAnswer } from '@/api/one-time-form/oneTimeFormSchema';

/**
 * 화면이 들고 있는 답(변환 전).
 * 텍스트·라디오·드롭다운·날짜·숫자·URL 은 입력 문자열, 체크박스는 고른 선택지, 이미지·파일은 `{ key, name }`.
 */
export type RawAnswer = string | string[] | OneTimeFormAttachmentAnswer;

/** 질문 ID 별 답. 아직 손대지 않은 질문은 키가 없다 */
export type RawAnswers = Record<number, RawAnswer | undefined>;

export const asText = (value: RawAnswer | undefined): string =>
  typeof value === 'string' ? value : '';

export const asTextList = (value: RawAnswer | undefined): string[] =>
  Array.isArray(value) ? value : [];

export const asAttachment = (
  value: RawAnswer | undefined,
): OneTimeFormAttachmentAnswer | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? value
    : undefined;

/** 계약 5.3 공통: null·""·공백 문자열·[] 는 미응답. 첨부는 키가 비면 미응답 */
export const isEmptyAnswer = (value: RawAnswer | undefined): boolean => {
  if (value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return value.key.trim() === '';
};
