import { describe, expect, it } from 'vitest';

import * as constants from './constants';
import { OPENING_BADGE, OPENING_FILTERS } from './constants';

/**
 * 백엔드 `LiveMentoringStatus` 3종(DRAFT/APPROVED/INACTIVE)만 존재한다
 * (자가승인 전환으로 PENDING_REVIEW/REJECTED 는 사라졌다). 상수가 이 집합과
 * 어긋나면 타입 에러가 나야 하지만, 런타임 값도 함께 검증한다.
 */
describe('live-mentoring constants — 상태', () => {
  /* 필터도 배지처럼 상품 상태가 아니라 열린 개설이 있는지로 거른다(LC-3336). */
  it('OPENING_FILTERS 는 전체·오픈중·미오픈 3개로 구성된다', () => {
    expect(OPENING_FILTERS).toEqual([
      { label: '전체', value: undefined },
      { label: '오픈중', value: true },
      { label: '미오픈', value: false },
    ]);
  });

  it('OPENING_FILTERS 의 라벨은 배지 라벨과 같다', () => {
    expect(OPENING_FILTERS[1].label).toBe(OPENING_BADGE.open.label);
    expect(OPENING_FILTERS[2].label).toBe(OPENING_BADGE.notOpen.label);
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

  it('OPENING_FILTERS 의 기본 선택지는 전체(undefined)다', () => {
    expect(OPENING_FILTERS[0]).toEqual({ label: '전체', value: undefined });
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
