import type { OneTimeFormQuestion } from '@/api/one-time-form/oneTimeFormSchema';
import { validateAnswer } from './answerValidation';
import {
  APPLICANT_FIELDS,
  validateApplicantInfo,
  type ApplicantField,
  type ApplicantInfo,
} from './applicantInfo';
import { isEmptyAnswer, type RawAnswers } from './rawAnswer';

/** 신청서 칸 이름. 필수 정보 3개와 `question-{질문 ID}` */
export type ApplicationFieldKey = ApplicantField | `question-${number}`;

export const questionFieldKey = (questionId: number): ApplicationFieldKey =>
  `question-${questionId}`;

/** 첫 오류 칸으로 스크롤·포커스할 때 쓰는 DOM id */
export const fieldDomId = (key: ApplicationFieldKey) =>
  `one-time-form-field-${key}`;

/**
 * 오류가 있는 칸만 화면 순서(필수 정보 -> 질문 순서)대로 담는다.
 * 키가 숫자가 아니라 넣은 순서가 유지되므로 첫 키가 첫 오류 칸이다.
 */
export const collectFieldErrors = (
  questions: OneTimeFormQuestion[],
  applicant: ApplicantInfo,
  answers: RawAnswers,
): Partial<Record<ApplicationFieldKey, string>> => {
  const errors: Partial<Record<ApplicationFieldKey, string>> = {};
  const applicantErrors = validateApplicantInfo(applicant);
  for (const field of APPLICANT_FIELDS) {
    const error = applicantErrors[field];
    if (error) errors[field] = error;
  }
  for (const question of questions) {
    const error = validateAnswer(question, answers[question.questionId]);
    if (error) errors[questionFieldKey(question.questionId)] = error;
  }
  return errors;
};

/** 필수 정보 3개나 필수 질문 중 비어 있는 것이 있는가. 있으면 하단 버튼을 막는다 */
export const hasEmptyRequiredField = (
  questions: OneTimeFormQuestion[],
  applicant: ApplicantInfo,
  answers: RawAnswers,
): boolean =>
  APPLICANT_FIELDS.some((field) => applicant[field].trim() === '') ||
  questions.some(
    (question) =>
      question.isRequired && isEmptyAnswer(answers[question.questionId]),
  );
