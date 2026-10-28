import { describe, expect, it } from 'vitest';

import type { QuestionDraft } from '../types/questionDraft';
import { validateQuestions } from './validateQuestions';

const draft = (overrides: Partial<QuestionDraft> = {}): QuestionDraft => ({
  key: 'k',
  questionId: null,
  type: 'SHORT_TEXT',
  title: '추천인',
  description: '',
  isRequired: false,
  choices: [],
  ...overrides,
});

describe('validateQuestions', () => {
  it('올바른 질문은 오류가 없다', () => {
    expect(
      validateQuestions([
        draft(),
        draft({ key: 'r', type: 'RADIO', choices: ['월', '', '수'] }),
      ]),
    ).toEqual({});
  });

  it('공백뿐인 문구는 비었다고 본다', () => {
    expect(validateQuestions([draft({ title: '   ' })])).toEqual({
      k: { title: '질문 문구를 입력해 주세요.' },
    });
  });

  it('문구 200자, 설명 1000자를 넘으면 막는다', () => {
    const errors = validateQuestions([
      draft({ title: 'a'.repeat(201), description: 'b'.repeat(1001) }),
    ]);
    expect(errors.k.title).toBe('200자 이하로 입력해 주세요.');
    expect(errors.k.description).toBe('1000자 이하로 입력해 주세요.');
    expect(
      validateQuestions([
        draft({ title: 'a'.repeat(200), description: 'b'.repeat(1000) }),
      ]),
    ).toEqual({});
  });

  it('선택형은 빈칸이 아닌 선택지가 하나는 있어야 한다', () => {
    expect(
      validateQuestions([draft({ type: 'CHECKBOX', choices: ['', ' '] })]).k
        .choices,
    ).toBe('선택지를 1개 이상 입력해 주세요.');
  });

  it('다듬은 뒤 같은 선택지가 있으면 막는다', () => {
    expect(
      validateQuestions([draft({ type: 'DROPDOWN', choices: ['월', ' 월'] })]).k
        .choices,
    ).toBe('같은 선택지가 두 번 있습니다: 월');
  });

  it('선택지 100자, 50개를 넘으면 막는다', () => {
    expect(
      validateQuestions([draft({ type: 'RADIO', choices: ['a'.repeat(101)] })])
        .k.choices,
    ).toBe('선택지는 100자 이하로 입력해 주세요.');

    const many = Array.from({ length: 51 }, (_, i) => `선택지${i}`);
    expect(
      validateQuestions([draft({ type: 'RADIO', choices: many })]).k.choices,
    ).toBe('선택지는 50개까지 넣을 수 있습니다.');
  });

  it('선택형이 아니면 선택지를 보지 않는다', () => {
    expect(
      validateQuestions([draft({ type: 'NUMBER', choices: ['', ''] })]),
    ).toEqual({});
  });
});
