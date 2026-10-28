import { describe, expect, it } from 'vitest';

import {
  getApplicationStatus,
  getApplicationStatusLabel,
  getPaymentAmountText,
  getSelectedOptionsText,
  groupSelectedOptions,
} from './applicationDisplay';

const payment = (paidAmount: number, refundAmount = 0) => ({
  paymentId: 1,
  orderId: 'letsTest',
  paidAmount,
  refundAmount,
});

describe('getApplicationStatus / getApplicationStatusLabel', () => {
  it.each([
    [
      '결제가 있는 신청',
      { payment: payment(49000), isCanceled: false },
      'PAID',
      '결제 완료',
    ],
    [
      '0원 결제',
      { payment: payment(0), isCanceled: false },
      'PAID',
      '결제 완료',
    ],
    ['무료 폼 신청', { payment: null, isCanceled: false }, 'FREE', '무료'],
    ['취소된 무료 신청', { payment: null, isCanceled: true }, 'FREE', '무료'],
    [
      '취소된 결제',
      { payment: payment(39000, 39000), isCanceled: true },
      'CANCELED',
      '취소(환불 39,000원)',
    ],
    [
      '취소된 0원 결제',
      { payment: payment(0), isCanceled: true },
      'CANCELED',
      '취소(환불 0원)',
    ],
  ] as const)('%s', (_, application, status, label) => {
    expect(getApplicationStatus(application)).toBe(status);
    expect(getApplicationStatusLabel(application)).toBe(label);
  });
});

describe('getPaymentAmountText', () => {
  it('결제가 없으면 무료, 0원 결제는 0원, 그 밖은 쉼표를 넣는다', () => {
    expect(getPaymentAmountText(null)).toBe('무료');
    expect(getPaymentAmountText(payment(0))).toBe('0원');
    expect(getPaymentAmountText(payment(49000))).toBe('49,000원');
  });
});

describe('getSelectedOptionsText', () => {
  const option = (optionId: number, optionName: string) => ({
    optionGroupId: 31,
    groupTitle: '참여 방식을 골라 주세요',
    optionId,
    optionName,
    additionalPrice: 0,
  });

  it('여러 옵션은 순서대로 쉼표로 잇는다', () => {
    expect(
      getSelectedOptionsText([
        option(311, '온라인 라이브'),
        option(321, '포트폴리오 1:1 첨삭'),
      ]),
    ).toBe('온라인 라이브, 포트폴리오 1:1 첨삭');
  });

  it('고른 옵션이 없으면 없음', () => {
    expect(getSelectedOptionsText([])).toBe('없음');
  });
});

describe('groupSelectedOptions', () => {
  const option = (
    optionGroupId: number,
    optionId: number,
    optionName: string,
  ) => ({
    optionGroupId,
    groupTitle: `그룹 ${optionGroupId}`,
    optionId,
    optionName,
    additionalPrice: 0,
  });

  it('같은 그룹의 옵션을 스냅샷 순서대로 묶는다', () => {
    const groups = groupSelectedOptions([
      option(31, 311, '온라인 라이브'),
      option(32, 321, '첨삭'),
      option(32, 322, '녹화본'),
    ]);

    expect(
      groups.map((g) => [g.groupTitle, g.options.map((o) => o.optionName)]),
    ).toEqual([
      ['그룹 31', ['온라인 라이브']],
      ['그룹 32', ['첨삭', '녹화본']],
    ]);
  });

  it('고른 옵션이 없으면 빈 배열이다', () => {
    expect(groupSelectedOptions([])).toEqual([]);
  });
});
