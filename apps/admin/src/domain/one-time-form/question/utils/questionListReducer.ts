import type {
  AdminOneTimeFormQuestion,
  OneTimeFormQuestionType,
  SaveOneTimeFormQuestionsRequest,
} from '@/api/one-time-form/oneTimeFormSchema';

import { isChoiceQuestionType } from '../constants/questionTypes';
import type { QuestionDraft, QuestionListState } from '../types/questionDraft';

type EditableField = Partial<
  Pick<QuestionDraft, 'title' | 'description' | 'isRequired'>
>;

export type QuestionListAction =
  | { type: 'reset'; questions: AdminOneTimeFormQuestion[] }
  | { type: 'add'; questionType: OneTimeFormQuestionType }
  | { type: 'update'; key: string; patch: EditableField }
  | { type: 'changeType'; key: string; questionType: OneTimeFormQuestionType }
  | { type: 'remove'; key: string }
  | { type: 'move'; from: number; to: number }
  | { type: 'addChoice'; key: string }
  | { type: 'updateChoice'; key: string; index: number; value: string }
  | { type: 'removeChoice'; key: string; index: number }
  | { type: 'moveChoice'; key: string; from: number; to: number };

const toDraft = (question: AdminOneTimeFormQuestion): QuestionDraft => ({
  key: `q-${question.questionId}`,
  questionId: question.questionId,
  type: question.type,
  title: question.title,
  description: question.description ?? '',
  isRequired: question.isRequired,
  choices: question.choices ?? [],
});

/** A3 `questions` 로 시작 상태를 만든다. 서버가 준 sortOrder 순서로 늘어놓는다 */
export const initQuestionListState = (
  questions: AdminOneTimeFormQuestion[],
): QuestionListState => ({
  questions: [...questions]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(toDraft),
  isDirty: false,
  nextKey: 0,
});

const moveItem = <T>(items: T[], from: number, to: number): T[] => {
  if (from === to || to < 0 || to >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

/** 선택형으로 처음 바뀔 때 빈 선택지 칸 하나를 준다 */
const withChoiceRow = (choices: string[], type: OneTimeFormQuestionType) =>
  isChoiceQuestionType(type) && choices.length === 0 ? [''] : choices;

const updateQuestion = (
  state: QuestionListState,
  key: string,
  update: (question: QuestionDraft) => QuestionDraft,
): QuestionListState => ({
  ...state,
  isDirty: true,
  questions: state.questions.map((question) =>
    question.key === key ? update(question) : question,
  ),
});

export const questionListReducer = (
  state: QuestionListState,
  action: QuestionListAction,
): QuestionListState => {
  switch (action.type) {
    case 'reset':
      return initQuestionListState(action.questions);
    case 'add':
      return {
        ...state,
        isDirty: true,
        nextKey: state.nextKey + 1,
        questions: [
          ...state.questions,
          {
            key: `new-${state.nextKey}`,
            questionId: null,
            type: action.questionType,
            title: '',
            description: '',
            isRequired: false,
            choices: withChoiceRow([], action.questionType),
          },
        ],
      };
    case 'update':
      return updateQuestion(state, action.key, (q) => ({
        ...q,
        ...action.patch,
      }));
    case 'changeType':
      return updateQuestion(state, action.key, (q) =>
        // 저장된 질문의 형식은 서버가 거절한다(QUESTION_TYPE_LOCKED)
        q.questionId === null
          ? {
              ...q,
              type: action.questionType,
              choices: withChoiceRow(q.choices, action.questionType),
            }
          : q,
      );
    case 'remove':
      return {
        ...state,
        isDirty: true,
        questions: state.questions.filter((q) => q.key !== action.key),
      };
    case 'move':
      return {
        ...state,
        isDirty: true,
        questions: moveItem(state.questions, action.from, action.to),
      };
    case 'addChoice':
      return updateQuestion(state, action.key, (q) => ({
        ...q,
        choices: [...q.choices, ''],
      }));
    case 'updateChoice':
      return updateQuestion(state, action.key, (q) => ({
        ...q,
        choices: q.choices.map((choice, i) =>
          i === action.index ? action.value : choice,
        ),
      }));
    case 'removeChoice':
      return updateQuestion(state, action.key, (q) => ({
        ...q,
        choices: q.choices.filter((_, i) => i !== action.index),
      }));
    case 'moveChoice':
      return updateQuestion(state, action.key, (q) => ({
        ...q,
        choices: moveItem(q.choices, action.from, action.to),
      }));
  }
};

/** 비어 있는 칸은 빼고 앞뒤 공백을 지운 선택지 */
export const toSavedChoices = (choices: string[]) =>
  choices.map((choice) => choice.trim()).filter(Boolean);

/**
 * A6 본문. 배열 순서가 sortOrder 라서 sortOrder 는 보내지 않는다.
 * 빠진 저장된 질문은 서버가 소프트 삭제한다. 선택형이 아니면 `choices: null`.
 */
export const toQuestionsRequest = (
  state: QuestionListState,
): SaveOneTimeFormQuestionsRequest => ({
  questions: state.questions.map((q) => ({
    questionId: q.questionId,
    type: q.type,
    title: q.title.trim(),
    description: q.description.trim() || null,
    isRequired: q.isRequired,
    choices: isChoiceQuestionType(q.type) ? toSavedChoices(q.choices) : null,
  })),
});
