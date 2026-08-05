import { describe, expect, it } from 'vitest';

import { resolveRefundableState, resolveRefundLabel } from '../refundState';

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

  it('0원 결제 취소는 전체 환불로 읽는다', () => {
    // 100% 할인 쿠폰과 어드민 테스트 참여. 두 값 모두 0 이라 나눌 금액이 없다.
    const label = resolveRefundLabel({
      isCanceled: true,
      isAdminRefunded: true,
      finalPrice: 0,
      originalPrice: 0,
    });

    expect(label.text).toBe('어드민 전체 환불');
  });

  it('원 결제액이 0인데 실결제액이 남아 있으면 단정하지 않는다', () => {
    // 서버는 originalPrice 를 null 이 아니라 엔티티 기본값 0 으로 내려준다.
    // updateRefundPrice 가 돌지 않은 레거시 취소 행이라 부분으로 읽으면 안 된다.
    const label = resolveRefundLabel({
      isCanceled: true,
      isAdminRefunded: false,
      finalPrice: 330000,
      originalPrice: 0,
    });

    expect(label.text).toBe('유저 환불');
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

describe('resolveRefundableState', () => {
  it('정상 참여자는 전체·부분 환불을 모두 할 수 있다', () => {
    const state = resolveRefundableState({
      isCanceled: false,
      hasUser: true,
      finalPrice: 330000,
    });

    expect(state.canRefund).toBe(true);
    expect(state.canPartialRefund).toBe(true);
  });

  it('이미 환불된 건은 다시 환불하지 못한다', () => {
    const state = resolveRefundableState({
      isCanceled: true,
      hasUser: true,
      finalPrice: 330000,
    });

    expect(state.canRefund).toBe(false);
    expect(state.reason).toBe('환불 완료');
  });

  it('참여자 정보가 없는 고아 신청서는 환불하지 못한다', () => {
    // user_id 가 NULL 이라 이름이 비는 행. 서버가 알림톡·로그 스냅샷에 user 를 쓰므로
    // 그대로 실행하면 NPE 가 난다.
    const state = resolveRefundableState({
      isCanceled: false,
      hasUser: false,
      finalPrice: 330000,
    });

    expect(state.canRefund).toBe(false);
    expect(state.reason).toBe('참여자 정보 없음');
  });

  it('0원 결제는 전체 환불만 할 수 있다', () => {
    // 100% 할인 쿠폰과 어드민 테스트 참여. 서버가 PG 를 건너뛰고 참여만 취소한다.
    const state = resolveRefundableState({
      isCanceled: false,
      hasUser: true,
      finalPrice: 0,
    });

    expect(state.canRefund).toBe(true);
    expect(state.canPartialRefund).toBe(false);
  });

  it('실결제액을 모르면 부분 환불을 막는다', () => {
    const state = resolveRefundableState({
      isCanceled: false,
      hasUser: true,
      finalPrice: null,
    });

    expect(state.canRefund).toBe(true);
    expect(state.canPartialRefund).toBe(false);
  });
});
