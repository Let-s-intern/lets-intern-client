import { describe, expect, it } from 'vitest';

import {
  type AdminOneTimeFormQuestion,
  saveOneTimeFormQuestionsRequestSchema,
} from '@/api/one-time-form/oneTimeFormSchema';

import type { QuestionListState } from '../types/questionDraft';
import {
  initQuestionListState,
  type QuestionListAction,
  questionListReducer,
  toQuestionsRequest,
} from './questionListReducer';

const radio: AdminOneTimeFormQuestion = {
  questionId: 101,
  type: 'RADIO',
  title: '희망 직무',
  description: null,
  isRequired: true,
  choices: ['프론트엔드', '백엔드', '데이터'],
  sortOrder: 0,
};

const longText: AdminOneTimeFormQuestion = {
  questionId: 102,
  type: 'LONG_TEXT',
  title: '지원 동기',
  description: '자유롭게 적어 주세요.',
  isRequired: false,
  choices: null,
  sortOrder: 1,
};

const run = (state: QuestionListState, ...actions: QuestionListAction[]) =>
  actions.reduce(questionListReducer, state);

const keyAt = (state: QuestionListState, index: number) =>
  state.questions[index].key;

describe('questionListReducer', () => {
  it('sortOrder 순서로 시작하고 변경 전에는 dirty 가 아니다', () => {
    const state = initQuestionListState([longText, radio]);
    expect(state.questions.map((q) => q.questionId)).toEqual([101, 102]);
    expect(state.isDirty).toBe(false);
  });

  it('질문을 추가하고 문구를 채우면 계약 A6 예시와 같은 본문이 된다', () => {
    let state = initQuestionListState([radio]);
    state = run(state, { type: 'add', questionType: 'SHORT_TEXT' });
    const key = keyAt(state, 1);
    state = run(state, {
      type: 'update',
      key,
      patch: { title: ' 추천인 ', description: '없으면 비워 두세요.' },
    });

    const body = toQuestionsRequest(state);
    // 계약 9절 A6 요청 예시 그대로
    expect(body).toEqual({
      questions: [
        {
          questionId: 101,
          type: 'RADIO',
          title: '희망 직무',
          description: null,
          isRequired: true,
          choices: ['프론트엔드', '백엔드', '데이터'],
        },
        {
          questionId: null,
          type: 'SHORT_TEXT',
          title: '추천인',
          description: '없으면 비워 두세요.',
          isRequired: false,
          choices: null,
        },
      ],
    });
    expect(state.isDirty).toBe(true);
    expect(saveOneTimeFormQuestionsRequestSchema.safeParse(body).success).toBe(
      true,
    );
    expect(body.questions[0]).not.toHaveProperty('sortOrder');
  });

  it('지운 질문은 본문에서 빠지고, 순서를 바꾸면 배열 순서가 바뀐다', () => {
    let state = initQuestionListState([radio, longText]);
    state = run(state, { type: 'move', from: 1, to: 0 });
    expect(
      toQuestionsRequest(state).questions.map((q) => q.questionId),
    ).toEqual([102, 101]);

    state = run(state, { type: 'remove', key: 'q-101' });
    expect(
      toQuestionsRequest(state).questions.map((q) => q.questionId),
    ).toEqual([102]);
  });

  it('범위 밖으로 옮기면 그대로 둔다', () => {
    const state = initQuestionListState([radio, longText]);
    const moved = run(state, { type: 'move', from: 0, to: -1 });
    expect(moved.questions).toEqual(state.questions);
  });

  it('선택지를 추가·수정·삭제·이동하면 빈칸을 빼고 다듬어 보낸다', () => {
    let state = initQuestionListState([radio]);
    const key = 'q-101';
    state = run(
      state,
      { type: 'addChoice', key },
      { type: 'updateChoice', key, index: 3, value: ' 디자인 ' },
      { type: 'removeChoice', key, index: 1 },
      { type: 'moveChoice', key, from: 2, to: 0 },
      { type: 'addChoice', key },
    );

    expect(state.questions[0].choices).toEqual([
      ' 디자인 ',
      '프론트엔드',
      '데이터',
      '',
    ]);
    expect(toQuestionsRequest(state).questions[0].choices).toEqual([
      '디자인',
      '프론트엔드',
      '데이터',
    ]);
  });

  it('저장 안 된 질문만 형식을 바꾸고, 선택형으로 바뀌면 빈 선택지 칸을 준다', () => {
    let state = initQuestionListState([radio]);
    state = run(
      state,
      { type: 'changeType', key: 'q-101', questionType: 'SHORT_TEXT' },
      { type: 'add', questionType: 'SHORT_TEXT' },
    );
    expect(state.questions[0].type).toBe('RADIO');

    const key = keyAt(state, 1);
    state = run(state, {
      type: 'changeType',
      key,
      questionType: 'CHECKBOX',
    });
    expect(state.questions[1]).toMatchObject({
      type: 'CHECKBOX',
      choices: [''],
    });

    state = run(state, { type: 'changeType', key, questionType: 'DATE' });
    expect(toQuestionsRequest(state).questions[1].choices).toBeNull();
  });

  it('새 질문마다 다른 키를 쓴다', () => {
    const state = run(
      initQuestionListState([]),
      { type: 'add', questionType: 'URL' },
      { type: 'add', questionType: 'URL' },
    );
    expect(keyAt(state, 0)).not.toBe(keyAt(state, 1));
  });

  it('저장 응답으로 되돌리면 새 ID 를 받고 dirty 가 풀린다', () => {
    let state = run(initQuestionListState([]), {
      type: 'add',
      questionType: 'URL',
    });
    state = run(state, {
      type: 'reset',
      questions: [{ ...longText, questionId: 300, sortOrder: 0 }],
    });
    expect(state.questions[0].questionId).toBe(300);
    expect(state.isDirty).toBe(false);
  });
});
