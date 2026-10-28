import type { OneTimeFormQuestion } from '@/api/one-time-form/oneTimeFormSchema';
import {
  asAttachment,
  asText,
  asTextList,
  isEmptyAnswer,
  type RawAnswer,
} from './rawAnswer';

// 계약 5.3 "서버 검증" 열을 화면에서 먼저 확인한다.

export const SHORT_TEXT_MAX_LENGTH = 200;
export const LONG_TEXT_MAX_LENGTH = 1000;
const URL_MAX_LENGTH = 2048;
const ATTACHMENT_NAME_MAX_LENGTH = 255;

export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
export const FILE_EXTENSIONS = ['pdf', 'docx', 'pptx', 'hwp', 'zip'];

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const URL_PATTERN = /^https?:\/\//;

const REQUIRED_MESSAGE: Record<OneTimeFormQuestion['type'], string> = {
  SHORT_TEXT: '답변을 입력해 주세요.',
  LONG_TEXT: '답변을 입력해 주세요.',
  RADIO: '항목을 선택해 주세요.',
  DROPDOWN: '항목을 선택해 주세요.',
  CHECKBOX: '항목을 하나 이상 선택해 주세요.',
  DATE: '날짜를 입력해 주세요.',
  NUMBER: '숫자를 입력해 주세요.',
  URL: '링크를 입력해 주세요.',
  IMAGE: '이미지를 첨부해 주세요.',
  FILE: '파일을 첨부해 주세요.',
};

const INVALID_CHOICE_MESSAGE = '선택지에서 골라 주세요.';

const isRealDate = (text: string): boolean => {
  const match = DATE_PATTERN.exec(text);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const extensionOf = (path: string): string => {
  const dot = path.lastIndexOf('.');
  return dot === -1 ? '' : path.slice(dot + 1).toLowerCase();
};

const validateFilled = (
  question: OneTimeFormQuestion,
  value: RawAnswer,
): string | null => {
  const choices = question.choices ?? [];

  switch (question.type) {
    case 'SHORT_TEXT':
    case 'LONG_TEXT': {
      const max =
        question.type === 'SHORT_TEXT'
          ? SHORT_TEXT_MAX_LENGTH
          : LONG_TEXT_MAX_LENGTH;
      return asText(value).trim().length > max
        ? `${max}자 이하로 입력해 주세요.`
        : null;
    }
    case 'RADIO':
    case 'DROPDOWN':
      return choices.includes(asText(value)) ? null : INVALID_CHOICE_MESSAGE;
    case 'CHECKBOX': {
      const picked = asTextList(value);
      const isUnique = new Set(picked).size === picked.length;
      return isUnique && picked.every((choice) => choices.includes(choice))
        ? null
        : INVALID_CHOICE_MESSAGE;
    }
    case 'DATE':
      return isRealDate(asText(value).trim())
        ? null
        : '올바른 날짜를 입력해 주세요.';
    case 'NUMBER':
      return Number.isFinite(Number(asText(value).trim()))
        ? null
        : '숫자만 입력해 주세요.';
    case 'URL': {
      const url = asText(value).trim();
      if (!URL_PATTERN.test(url))
        return 'http:// 또는 https:// 로 시작하는 주소를 입력해 주세요.';
      return url.length > URL_MAX_LENGTH
        ? `${URL_MAX_LENGTH}자 이하로 입력해 주세요.`
        : null;
    }
    case 'IMAGE':
    case 'FILE': {
      const attachment = asAttachment(value);
      const extensions =
        question.type === 'IMAGE' ? IMAGE_EXTENSIONS : FILE_EXTENSIONS;
      if (!attachment || !extensions.includes(extensionOf(attachment.key)))
        return `${extensions.join(', ')} 파일만 올릴 수 있어요.`;
      const nameLength = attachment.name.trim().length;
      return nameLength >= 1 && nameLength <= ATTACHMENT_NAME_MAX_LENGTH
        ? null
        : `파일 이름은 ${ATTACHMENT_NAME_MAX_LENGTH}자 이하여야 해요.`;
    }
  }
};

/** 질문 하나의 답을 검사한다. 문제가 없으면 null, 있으면 칸 아래에 띄울 문구 */
export const validateAnswer = (
  question: OneTimeFormQuestion,
  value: RawAnswer | undefined,
): string | null => {
  if (value === undefined || isEmptyAnswer(value)) {
    return question.isRequired ? REQUIRED_MESSAGE[question.type] : null;
  }
  return validateFilled(question, value);
};
