import { describe, expect, it } from 'vitest';

import {
  isTestPayment,
  resolveRefundableState,
  resolveRefundLabel,
} from '../refundState';

describe('resolveRefundLabel', () => {
  it('취소되지 않았으면 N 이다', () => {
    const label = resolveRefundLabel({
      isCanceled: false,
      isAdminRefunded: false,
      finalPrice: 330000,
      originalPrice: null,
    });

    expect(label.text).toBe('N');
    expect(label.isRefunded).toBe(false);
  });

  it('어드민 환불 건은 강조 라벨로 구분한다', () => {
    const label = resolveRefundLabel({
      isCanceled: true,
      isAdminRefunded: true,
      finalPrice: 330000,
      originalPrice: 330000,
    });

    expect(label.text).toBe('어드민 전체 환불');
    expect(label.isAdmin).toBe(true);
  });

  it('어드민이 부분 환불하면 환불액이 원 결제액보다 작다', () => {
    const label = resolveRefundLabel({
      isCanceled: true,
      isAdminRefunded: true,
      finalPrice: 220000,
      originalPrice: 330000,
    });

    expect(label.text).toBe('어드민 부분 환불');
    expect(label.isAdmin).toBe(true);
  });

  it('유저가 전액 환불하면 환불액과 원 결제액이 같다', () => {
    // Payment.updateRefundPrice 가 원 결제액을 originalPrice 로 옮기고
    // finalPrice 에 환불액을 덮어쓴다. 두 값이 같으면 전액이다.
    const label = resolveRefundLabel({
      isCanceled: true,
      isAdminRefunded: false,
      finalPrice: 330000,
      originalPrice: 330000,
    });

    expect(label.text).toBe('유저 전체 환불');
    expect(label.isAdmin).toBe(false);
  });

  it('유저가 부분 환불하면 환불액이 원 결제액보다 작다', () => {
    const label = resolveRefundLabel({
      isCanceled: true,
      isAdminRefunded: false,
      finalPrice: 220000,
      originalPrice: 330000,
    });

    expect(label.text).toBe('유저 부분 환불');
  });

  it('원 결제액을 모르면 전체·부분을 단정하지 않는다', () => {
    const label = resolveRefundLabel({
      isCanceled: true,
      isAdminRefunded: false,
      finalPrice: 330000,
      originalPrice: null,
    });

    expect(label.text).toBe('유저 환불');
  });

  it('어드민 환불이면 금액 정보가 없어도 어드민으로 표시한다', () => {
    // 어드민 환불이 전액뿐이던 시절의 이력. 전체로 둔다.
    const label = resolveRefundLabel({
      isCanceled: true,
      isAdminRefunded: true,
      finalPrice: null,
      originalPrice: null,
    });

    expect(label.text).toBe('어드민 전체 환불');
  });

  it('다섯 갈래가 서로 겹치지 않는다', () => {
    const labels = [
      resolveRefundLabel({
        isCanceled: false,
        isAdminRefunded: false,
        finalPrice: 330000,
        originalPrice: null,
      }),
      resolveRefundLabel({
        isCanceled: true,
        isAdminRefunded: true,
        finalPrice: 330000,
        originalPrice: 330000,
      }),
      resolveRefundLabel({
        isCanceled: true,
        isAdminRefunded: true,
        finalPrice: 220000,
        originalPrice: 330000,
      }),
      resolveRefundLabel({
        isCanceled: true,
        isAdminRefunded: false,
        finalPrice: 330000,
        originalPrice: 330000,
      }),
      resolveRefundLabel({
        isCanceled: true,
        isAdminRefunded: false,
        finalPrice: 220000,
        originalPrice: 330000,
      }),
    ].map((label) => label.text);

    expect(labels).toEqual([
      'N',
      '어드민 전체 환불',
      '어드민 부분 환불',
      '유저 전체 환불',
      '유저 부분 환불',
    ]);
  });
});

describe('isTestPayment', () => {
  it('어드민 테스트 참여 결제를 주문번호로 판별한다', () => {
    // createTestChallengePayment 가 paymentKey 와 orderId 에 같은 값을 넣는다.
    expect(isTestPayment('TEST_CHALLENGE_14499')).toBe(true);
  });

  it('실결제 주문번호는 테스트 결제가 아니다', () => {
    expect(isTestPayment('letsBX385104')).toBe(false);
    expect(isTestPayment(null)).toBe(false);
  });
});

describe('resolveRefundableState', () => {
  it('정상 참여자는 환불할 수 있다', () => {
    expect(
      resolveRefundableState({
        isCanceled: false,
        hasUser: true,
        isTestPayment: false,
      }).canRefund,
    ).toBe(true);
  });

  it('이미 환불된 건은 다시 환불하지 못한다', () => {
    const state = resolveRefundableState({
      isCanceled: true,
      hasUser: true,
      isTestPayment: false,
    });

    expect(state.canRefund).toBe(false);
    expect(state.reason).toBe('환불 완료');
  });

  it('참여자 정보가 없는 고아 신청서는 환불하지 못한다', () => {
    // user_id 가 NULL 이라 이름이 비는 행. 대상자를 특정할 수 없어 확인 단계가 성립하지 않는다.
    const state = resolveRefundableState({
      isCanceled: false,
      hasUser: false,
      isTestPayment: false,
    });

    expect(state.canRefund).toBe(false);
    expect(state.reason).toBe('참여자 정보 없음');
  });

  it('테스트 결제는 환불하지 못한다', () => {
    const state = resolveRefundableState({
      isCanceled: false,
      hasUser: true,
      isTestPayment: true,
    });

    expect(state.canRefund).toBe(false);
    expect(state.reason).toBe('테스트 결제');
  });
});
