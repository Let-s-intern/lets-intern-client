import dayjs from '@/lib/dayjs';
import { describe, expect, it } from 'vitest';
import {
  formatCouponLabel,
  resolvePurchaseStatus,
  splitPurchaseHistory,
} from '../purchaseHistory';

const now = dayjs('2026-11-27T12:00:00');

describe('resolvePurchaseStatus', () => {
  it('취소된 신청은 기간과 상관없이 환불·취소됨이다', () => {
    expect(
      resolvePurchaseStatus(
        {
          isCanceled: true,
          programStartDate: '2026-11-01T00:00:00',
          programEndDate: '2026-12-31T00:00:00',
        },
        now,
      ),
    ).toBe('환불·취소됨');
  });

  it('시작 전이면 진행 전이다', () => {
    expect(
      resolvePurchaseStatus(
        {
          programStartDate: '2026-12-01T00:00:00',
          programEndDate: '2026-12-31T00:00:00',
        },
        now,
      ),
    ).toBe('진행 전');
  });

  it('기간 안이면 진행 중이다', () => {
    expect(
      resolvePurchaseStatus(
        {
          programStartDate: '2026-11-01T00:00:00',
          programEndDate: '2026-12-31T00:00:00',
        },
        now,
      ),
    ).toBe('진행 중');
  });

  it('종료 시각이 지났으면 종료다', () => {
    expect(
      resolvePurchaseStatus(
        {
          programStartDate: '2026-10-01T00:00:00',
          programEndDate: '2026-11-20T00:00:00',
        },
        now,
      ),
    ).toBe('종료');
  });

  it('날짜만 오는 종료일은 그날까지 진행 중이다', () => {
    expect(
      resolvePurchaseStatus(
        { programStartDate: '2026-11-01', programEndDate: '2026-11-27' },
        now,
      ),
    ).toBe('진행 중');
  });

  it('기간이 없으면 기간 없음이다', () => {
    expect(resolvePurchaseStatus({}, now)).toBe('기간 없음');
  });
});

describe('splitPurchaseHistory', () => {
  it('진행 전과 진행 중은 참여중, 나머지는 참여했던으로 나눈다', () => {
    const items = [
      { applicationId: 1, programStartDate: '2026-12-01T00:00:00' },
      { applicationId: 2, programEndDate: '2026-12-31T00:00:00' },
      { applicationId: 3, programEndDate: '2026-11-01T00:00:00' },
      { applicationId: 4, isCanceled: true, programEndDate: '2026-12-31' },
      { applicationId: 5 },
    ];
    const { current, past } = splitPurchaseHistory(items, now);
    expect(current.map(({ item }) => item.applicationId)).toEqual([1, 2]);
    expect(past.map(({ item }) => item.applicationId)).toEqual([3, 4, 5]);
    expect(past.map(({ status }) => status)).toEqual([
      '종료',
      '환불·취소됨',
      '기간 없음',
    ]);
  });
});

describe('formatCouponLabel', () => {
  it('쿠폰 할인 -1 은 100% 할인으로 적는다', () => {
    expect(formatCouponLabel('전액 쿠폰', -1)).toBe('전액 쿠폰 (100% 할인)');
  });

  it('쿠폰이 없으면 없음이다', () => {
    expect(formatCouponLabel(null, null)).toBe('없음');
  });
});
