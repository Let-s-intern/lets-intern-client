import type {
  AdminOneTimeFormApplicationQuestion,
  OneTimeFormAnswers,
  OneTimeFormAnswerValue,
  OneTimeFormQuestionType,
} from '@/api/one-time-form/oneTimeFormSchema';

/**
 * 신청 상세의 답 표시(계약 5.3, 6.1).
 *
 * 질문 형식과 저장된 값의 모양이 어긋나도(형식 변경 전 답, 서버 버그) 화면이 깨지지 않도록
 * 예상한 모양이 아니면 문자열로 바꿔 보여준다.
 */

export type AnswerDisplay =
  | { kind: 'EMPTY' }
  | { kind: 'TEXT'; text: string }
  | { kind: 'LINK'; href: string }
  | { kind: 'IMAGE' | 'FILE'; name: string };

export interface AnswerRow {
  question: AdminOneTimeFormApplicationQuestion;
  value: OneTimeFormAnswerValue | undefined;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;
const URL_PATTERN = /^https?:\/\//i;

const EMPTY: AnswerDisplay = { kind: 'EMPTY' };

/** 서버가 미응답으로 보는 값(계약 5.3 공통) */
const isEmptyAnswer = (value: unknown) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0);

const isAttachment = (value: unknown): value is { name: string } =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { name?: unknown }).name === 'string';

const toSafeText = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(toSafeText).join(', ');
  if (isAttachment(value)) return value.name;
  return JSON.stringify(value) ?? String(value);
};

const text = (value: string): AnswerDisplay => ({ kind: 'TEXT', text: value });

export const toAnswerDisplay = (
  type: OneTimeFormQuestionType,
  value: unknown,
): AnswerDisplay => {
  if (isEmptyAnswer(value)) return EMPTY;

  switch (type) {
    case 'DATE':
      return text(
        typeof value === 'string' && DATE_PATTERN.test(value)
          ? value.slice(0, 10)
          : toSafeText(value),
      );
    // http(s) 가 아니면 링크로 만들지 않는다(`javascript:` 등)
    case 'URL':
      return typeof value === 'string' && URL_PATTERN.test(value)
        ? { kind: 'LINK', href: value }
        : text(toSafeText(value));
    case 'IMAGE':
    case 'FILE':
      return isAttachment(value)
        ? { kind: type, name: value.name }
        : text(toSafeText(value));
    // 체크박스는 `, ` 로 잇고, 나머지 문자열·숫자는 그대로 보여준다
    default:
      return text(toSafeText(value));
  }
};

/** 삭제된 질문은 제목 뒤에 `(삭제됨)` 을 붙인다 */
export const getQuestionTitle = (
  question: Pick<AdminOneTimeFormApplicationQuestion, 'title' | 'isDeleted'>,
) => (question.isDeleted ? `${question.title} (삭제됨)` : question.title);

/**
 * 질문 순서(`sortOrder`, 같으면 ID)대로 답을 붙인다.
 * 삭제된 질문은 답이 있을 때만 남긴다. 신청 뒤에 생긴 질문은 미응답으로 남는다.
 */
export const getAnswerRows = (
  questions: AdminOneTimeFormApplicationQuestion[],
  answers: OneTimeFormAnswers,
): AnswerRow[] =>
  [...questions]
    .sort((a, b) => a.sortOrder - b.sortOrder || a.questionId - b.questionId)
    .map((question) => ({
      question,
      value: answers[String(question.questionId)],
    }))
    .filter(
      ({ question, value }) => !question.isDeleted || !isEmptyAnswer(value),
    );
