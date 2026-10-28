import { describe, expect, it } from 'vitest';

import type { AdminOneTimeFormApplicationQuestion } from '@/api/one-time-form/oneTimeFormSchema';

import {
  getAnswerRows,
  getQuestionTitle,
  toAnswerDisplay,
} from './answerDisplay';

const attachment = (name: string) => ({
  key: `one-time-form/attachment/7/${name}`,
  name,
});

describe('toAnswerDisplay', () => {
  it('체크박스는 고른 값을 쉼표로 잇는다', () => {
    expect(toAnswerDisplay('CHECKBOX', ['월', '수'])).toEqual({
      kind: 'TEXT',
      text: '월, 수',
    });
  });

  it('날짜는 YYYY-MM-DD 로 보여준다', () => {
    expect(toAnswerDisplay('DATE', '2027-02-20')).toEqual({
      kind: 'TEXT',
      text: '2027-02-20',
    });
    expect(toAnswerDisplay('DATE', '2027-02-20T00:00:00')).toEqual({
      kind: 'TEXT',
      text: '2027-02-20',
    });
  });

  it('숫자는 숫자 그대로 보여준다', () => {
    expect(toAnswerDisplay('NUMBER', 18)).toEqual({ kind: 'TEXT', text: '18' });
    expect(toAnswerDisplay('NUMBER', 0)).toEqual({ kind: 'TEXT', text: '0' });
  });

  it('URL 은 http(s) 일 때만 링크로 만든다', () => {
    expect(toAnswerDisplay('URL', 'https://portfolio.example.com/kim')).toEqual(
      { kind: 'LINK', href: 'https://portfolio.example.com/kim' },
    );
    expect(toAnswerDisplay('URL', 'javascript:alert(1)')).toEqual({
      kind: 'TEXT',
      text: 'javascript:alert(1)',
    });
  });

  it('장문은 줄바꿈을 그대로 둔다', () => {
    expect(toAnswerDisplay('LONG_TEXT', '첫 줄\n둘째 줄')).toEqual({
      kind: 'TEXT',
      text: '첫 줄\n둘째 줄',
    });
  });

  it('이미지·파일은 원본 파일명을 준다', () => {
    expect(toAnswerDisplay('IMAGE', attachment('프로필.png'))).toEqual({
      kind: 'IMAGE',
      name: '프로필.png',
    });
    expect(toAnswerDisplay('FILE', attachment('이력서.pdf'))).toEqual({
      kind: 'FILE',
      name: '이력서.pdf',
    });
  });

  it.each([undefined, null, '', '   ', []])(
    '미응답(%j)은 비어 있다',
    (value) => {
      expect(toAnswerDisplay('SHORT_TEXT', value)).toEqual({ kind: 'EMPTY' });
    },
  );

  it.each([
    ['체크박스에 문자열', 'CHECKBOX', '월', '월'],
    ['날짜에 숫자', 'DATE', 20270220, '20270220'],
    ['파일에 문자열', 'FILE', 'a.pdf', 'a.pdf'],
    ['URL 에 배열', 'URL', ['a', 'b'], 'a, b'],
    ['단답에 첨부', 'SHORT_TEXT', attachment('a.png'), 'a.png'],
    ['이미지에 이름 없는 객체', 'IMAGE', { key: 'k' }, '{"key":"k"}'],
  ] as const)('%s 는 문자열로 보여준다', (_, type, value, expected) => {
    expect(toAnswerDisplay(type, value)).toEqual({
      kind: 'TEXT',
      text: expected,
    });
  });
});

describe('getAnswerRows', () => {
  const question = (
    questionId: number,
    sortOrder: number,
    isDeleted = false,
  ): AdminOneTimeFormApplicationQuestion => ({
    questionId,
    type: 'SHORT_TEXT',
    title: `질문 ${questionId}`,
    sortOrder,
    isDeleted,
  });

  it('sortOrder, 같으면 질문 ID 순으로 답을 붙인다', () => {
    const rows = getAnswerRows(
      [question(103, 2), question(101, 0), question(100, 0, true)],
      { '100': '삭제 전 답', '101': '프론트엔드' },
    );

    expect(rows.map((r) => [r.question.questionId, r.value])).toEqual([
      [100, '삭제 전 답'],
      [101, '프론트엔드'],
      [103, undefined],
    ]);
  });

  it('삭제된 질문은 답이 없으면 뺀다', () => {
    const rows = getAnswerRows([question(100, 0, true), question(101, 0)], {});

    expect(rows.map((r) => r.question.questionId)).toEqual([101]);
  });
});

describe('getQuestionTitle', () => {
  it('삭제된 질문은 제목 뒤에 (삭제됨) 을 붙인다', () => {
    expect(getQuestionTitle({ title: '이전 질문', isDeleted: true })).toBe(
      '이전 질문 (삭제됨)',
    );
    expect(getQuestionTitle({ title: '희망 직무', isDeleted: false })).toBe(
      '희망 직무',
    );
  });
});
