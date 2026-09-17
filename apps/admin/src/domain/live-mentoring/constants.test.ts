import { describe, expect, it } from 'vitest';

import * as constants from './constants';
import { OPENING_BADGE, STATUS_FILTERS } from './constants';

/**
 * 백엔드 `LiveMentoringStatus` 3종(DRAFT/APPROVED/INACTIVE)만 존재한다
 * (자가승인 전환으로 PENDING_REVIEW/REJECTED 는 사라졌다). 상수가 이 집합과
 * 어긋나면 타입 에러가 나야 하지만, 런타임 값도 함께 검증한다.
 */
describe('live-mentoring constants — 상태', () => {
  /*
    승인 절차가 사라진 뒤로(LC-3262) 「초안」은 새로 생기지 않는 옛 값이라 필터에서 뺐다.
    갈라 볼 의미가 있는 것은 쓰는 상품과 더 쓰지 않는 상품뿐이다.
  */
  it('STATUS_FILTERS 는 전체·오픈 중·비활성 3개로 구성된다', () => {
    expect(STATUS_FILTERS).toEqual([
      { label: '전체', value: undefined },
      { label: '오픈 중', value: 'APPROVED' },
      { label: '비활성', value: 'INACTIVE' },
    ]);
  });

  /* 「승인」이라고 적으면 아직 승인 단계가 있는 것처럼 읽힌다. */
  it('상태 표기에 승인이라는 말을 쓰지 않는다', () => {
    expect(
      Object.values(OPENING_BADGE).map(({ label }) => label),
    ).not.toContain('승인');
  });

  /* 상품 상태 기준 표기는 개설이 없어도 「오픈 중」을 찍어 걷어냈다(LC-3336). */
  it('상품 상태 기준 라벨·클래스를 더 이상 export 하지 않는다', () => {
    expect(constants).not.toHaveProperty('STATUS_LABELS');
    expect(constants).not.toHaveProperty('STATUS_CLASSES');
  });

  it('STATUS_FILTERS 의 기본 선택지는 전체(undefined)다', () => {
    expect(STATUS_FILTERS[0]).toEqual({ label: '전체', value: undefined });
  });
});

/**
 * 슬롯 오픈 전환으로 개설에서 모집 기간이 사라졌다. 기간 포맷과 만료 판정은
 * 근거가 없어져 삭제했다. 다른 화면에서 다시 끌어 쓰지 않도록 부재를 고정한다.
 */
describe('live-mentoring constants — 기간 관련 상수 삭제', () => {
  it('formatPeriod 와 isExpired 를 더 이상 export 하지 않는다', () => {
    expect(constants).not.toHaveProperty('formatPeriod');
    expect(constants).not.toHaveProperty('isExpired');
  });

  it('가격 관련 export 는 그대로 남는다', () => {
    expect(
      constants.durationPricesLabel([{ duration: 30, price: 35000 }]),
    ).toBe('30분 35,000원');
  });
});
