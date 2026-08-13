import { describe, expect, it } from 'vitest';

import { liveMentoringStatusSchema } from '@/api/live-mentoring/liveMentoringSchema';
import * as constants from './constants';
import { STATUS_CLASSES, STATUS_FILTERS, STATUS_LABELS } from './constants';

/**
 * 백엔드 `LiveMentoringStatus` 3종(DRAFT/APPROVED/INACTIVE)만 존재한다
 * (자가승인 전환으로 PENDING_REVIEW/REJECTED 는 사라졌다). 상수가 이 집합과
 * 어긋나면 타입 에러가 나야 하지만, 런타임 값도 함께 검증한다.
 */
describe('live-mentoring constants — 상태', () => {
  const validStatuses = liveMentoringStatusSchema.options;

  it('STATUS_LABELS 는 유효한 상태 3종에 대해서만 라벨을 갖는다', () => {
    expect(Object.keys(STATUS_LABELS).sort()).toEqual(
      [...validStatuses].sort(),
    );
  });

  it('STATUS_CLASSES 는 유효한 상태 3종에 대해서만 클래스를 갖는다', () => {
    expect(Object.keys(STATUS_CLASSES).sort()).toEqual(
      [...validStatuses].sort(),
    );
  });

  it('STATUS_FILTERS 는 전체·초안·승인·비활성 4개로 구성된다', () => {
    expect(STATUS_FILTERS).toEqual([
      { label: '전체', value: undefined },
      { label: '초안', value: 'DRAFT' },
      { label: '승인', value: 'APPROVED' },
      { label: '비활성', value: 'INACTIVE' },
    ]);
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
