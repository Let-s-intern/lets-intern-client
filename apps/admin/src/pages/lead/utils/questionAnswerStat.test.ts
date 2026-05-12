import { describe, expect, it } from 'vitest';

import { questionAnswerStat } from './questionAnswerStat';

describe('questionAnswerStat', () => {
  it('빈 입력은 total/answered/percent 모두 0을 반환한다', () => {
    expect(questionAnswerStat([])).toEqual({
      total: 0,
      answered: 0,
      percent: 0,
    });
  });

  it('모든 신청자가 답변하면 percent는 100이다', () => {
    const items = [
      { questionAnswerList: [{ answer: '응답 1' }] },
      { questionAnswerList: [{ answer: '응답 2' }] },
    ];
    expect(questionAnswerStat(items)).toEqual({
      total: 2,
      answered: 2,
      percent: 100,
    });
  });

  it('3명 중 2명 답변 시 percent를 반올림한다 (67%)', () => {
    const items = [
      { questionAnswerList: [{ answer: '응답' }] },
      { questionAnswerList: [{ answer: '응답' }] },
      { questionAnswerList: [{ answer: '' }] },
    ];
    expect(questionAnswerStat(items)).toEqual({
      total: 3,
      answered: 2,
      percent: 67,
    });
  });

  it('answer가 공백 문자열만 있으면 답변 안 한 것으로 카운트한다', () => {
    const items = [
      { questionAnswerList: [{ answer: '   ' }] },
      { questionAnswerList: [{ answer: '\t\n' }] },
      { questionAnswerList: [{ answer: '실제 응답' }] },
    ];
    expect(questionAnswerStat(items)).toEqual({
      total: 3,
      answered: 1,
      percent: 33,
    });
  });

  it('questionAnswerList가 빈 배열이면 답변 안 한 것으로 카운트한다', () => {
    const items = [
      { questionAnswerList: [] },
      { questionAnswerList: [{ answer: '응답' }] },
    ];
    expect(questionAnswerStat(items)).toEqual({
      total: 2,
      answered: 1,
      percent: 50,
    });
  });

  it('answer가 null/undefined이면 답변 안 한 것으로 카운트한다', () => {
    const items = [
      { questionAnswerList: [{ answer: null }] },
      { questionAnswerList: [{ answer: undefined }] },
      { questionAnswerList: [{ answer: '응답' }] },
    ];
    expect(questionAnswerStat(items)).toEqual({
      total: 3,
      answered: 1,
      percent: 33,
    });
  });
});
