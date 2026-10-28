import type {
  OneTimeFormAnswers,
  OneTimeFormAnswerValue,
  OneTimeFormQuestion,
} from '@/api/one-time-form/oneTimeFormSchema';
import {
  asAttachment,
  asText,
  asTextList,
  isEmptyAnswer,
  type RawAnswer,
  type RawAnswers,
} from './rawAnswer';

const toAnswerValue = (
  question: OneTimeFormQuestion,
  value: RawAnswer,
): OneTimeFormAnswerValue => {
  switch (question.type) {
    case 'NUMBER':
      return Number(asText(value).trim());
    case 'CHECKBOX': {
      const picked = new Set(asTextList(value));
      return (question.choices ?? []).filter((choice) => picked.has(choice));
    }
    case 'IMAGE':
    case 'FILE':
      return asAttachment(value) ?? { key: '', name: '' };
    default:
      return asText(value).trim();
  }
};

/**
 * 계약 6.1·U3 의 `answers`. 질문 ID 문자열을 키로 쓰고, 미응답은 키를 뺀다.
 * 숫자는 JSON 숫자, 체크박스는 선택지 순서대로의 문자열 배열, 텍스트는 앞뒤 공백을 자른다.
 * 폼에 없는 질문의 답은 버린다.
 */
export const answersToJson = (
  questions: OneTimeFormQuestion[],
  answers: RawAnswers,
): OneTimeFormAnswers => {
  const result: OneTimeFormAnswers = {};
  for (const question of questions) {
    const value = answers[question.questionId];
    if (value === undefined || isEmptyAnswer(value)) continue;
    result[String(question.questionId)] = toAnswerValue(question, value);
  }
  return result;
};
