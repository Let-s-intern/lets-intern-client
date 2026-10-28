import {
  isChoiceQuestionType,
  QUESTION_LIMITS,
} from '../constants/questionTypes';
import type {
  QuestionDraft,
  QuestionDraftErrors,
  QuestionListErrors,
} from '../types/questionDraft';
import { toSavedChoices } from './questionListReducer';

/**
 * 계약 5.6 길이 제한과 A6 `ONE_TIME_FORM_CHOICES_REQUIRED` 조건을 저장 전에 본다.
 * 빈 선택지 칸은 저장할 때 빠지므로 오류로 보지 않는다.
 */

const getChoicesError = (choices: string[]): string | undefined => {
  const saved = toSavedChoices(choices);
  if (saved.length === 0) return '선택지를 1개 이상 입력해 주세요.';
  if (saved.length > QUESTION_LIMITS.choiceCount) {
    return `선택지는 ${QUESTION_LIMITS.choiceCount}개까지 넣을 수 있습니다.`;
  }
  if (saved.some((choice) => choice.length > QUESTION_LIMITS.choice)) {
    return `선택지는 ${QUESTION_LIMITS.choice}자 이하로 입력해 주세요.`;
  }
  const duplicated = saved.find((choice, i) => saved.indexOf(choice) !== i);
  if (duplicated !== undefined) {
    return `같은 선택지가 두 번 있습니다: ${duplicated}`;
  }
  return undefined;
};

const validateQuestion = (question: QuestionDraft): QuestionDraftErrors => {
  const errors: QuestionDraftErrors = {};
  const title = question.title.trim();
  if (!title) errors.title = '질문 문구를 입력해 주세요.';
  else if (title.length > QUESTION_LIMITS.title) {
    errors.title = `${QUESTION_LIMITS.title}자 이하로 입력해 주세요.`;
  }
  if (question.description.trim().length > QUESTION_LIMITS.description) {
    errors.description = `${QUESTION_LIMITS.description}자 이하로 입력해 주세요.`;
  }
  if (isChoiceQuestionType(question.type)) {
    const choicesError = getChoicesError(question.choices);
    if (choicesError) errors.choices = choicesError;
  }
  return errors;
};

/** 오류가 있는 질문만 키로 담는다 */
export const validateQuestions = (
  questions: QuestionDraft[],
): QuestionListErrors => {
  const result: QuestionListErrors = {};
  for (const question of questions) {
    const errors = validateQuestion(question);
    if (Object.keys(errors).length > 0) result[question.key] = errors;
  }
  return result;
};
