import {
  CHOICE_QUESTION_TYPES,
  type OneTimeFormQuestionType,
} from '@/api/one-time-form/oneTimeFormSchema';

/** 계약 5.3 의 어드민 표시 이름. 순서가 형식 선택 목록의 순서다 */
export const QUESTION_TYPE_LABELS: Record<OneTimeFormQuestionType, string> = {
  SHORT_TEXT: '단답',
  LONG_TEXT: '장문',
  RADIO: '라디오',
  DROPDOWN: '드롭다운',
  CHECKBOX: '체크박스',
  DATE: '날짜',
  NUMBER: '숫자',
  URL: 'URL',
  IMAGE: '이미지',
  FILE: '파일',
};

export const QUESTION_TYPES = Object.keys(
  QUESTION_TYPE_LABELS,
) as OneTimeFormQuestionType[];

export const isChoiceQuestionType = (type: OneTimeFormQuestionType) =>
  CHOICE_QUESTION_TYPES.includes(type);

/** 계약 5.6 질문 길이 제한 */
export const QUESTION_LIMITS = {
  title: 200,
  description: 1000,
  choice: 100,
  choiceCount: 50,
} as const;
