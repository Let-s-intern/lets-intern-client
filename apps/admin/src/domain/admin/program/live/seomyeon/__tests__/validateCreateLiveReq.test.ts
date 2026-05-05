import { describe, expect, it } from 'vitest';

import { validateCreateLiveReq } from '../validateCreateLiveReq';

describe('validateCreateLiveReq — variant 별 검증 분기', () => {
  const baseValid = {
    title: '제목',
    shortDesc: '한 줄 설명',
    progressType: 'ONLINE' as const,
    place: '',
  };

  it('LIVE: 모든 필드가 채워지면 통과한다', () => {
    expect(validateCreateLiveReq(baseValid, 'LIVE')).toEqual([]);
  });

  it('LIVE: progressType이 비어있으면 실패한다', () => {
    const errors = validateCreateLiveReq(
      { ...baseValid, progressType: undefined },
      'LIVE',
    );
    expect(errors).toContain('온/오프라인 여부을(를) 입력해주세요.');
  });

  it('SEOMYEON: progressType이 없어도 통과한다', () => {
    const errors = validateCreateLiveReq(
      { ...baseValid, progressType: undefined },
      'SEOMYEON',
    );
    expect(errors).toEqual([]);
  });

  it('SEOMYEON: place가 빈 문자열이어도 통과한다', () => {
    const errors = validateCreateLiveReq(
      { ...baseValid, place: '' },
      'SEOMYEON',
    );
    expect(errors).toEqual([]);
  });

  it('LIVE/SEOMYEON 공통: 제목이 비어있으면 실패한다', () => {
    const liveErrors = validateCreateLiveReq(
      { ...baseValid, title: '' },
      'LIVE',
    );
    const seomyeonErrors = validateCreateLiveReq(
      { ...baseValid, title: '' },
      'SEOMYEON',
    );
    expect(liveErrors).toContain('제목을(를) 입력해주세요.');
    expect(seomyeonErrors).toContain('제목을(를) 입력해주세요.');
  });

  it('LIVE/SEOMYEON 공통: 한 줄 설명이 공백만 있으면 실패한다', () => {
    const errors = validateCreateLiveReq(
      { ...baseValid, shortDesc: '   ' },
      'LIVE',
    );
    expect(errors).toContain('한 줄 설명을(를) 입력해주세요.');
  });

  it('LIVE: 여러 필드가 누락되면 모든 에러를 누적한다', () => {
    const errors = validateCreateLiveReq(
      { title: '', shortDesc: '', progressType: undefined },
      'LIVE',
    );
    expect(errors).toHaveLength(3);
  });
});
