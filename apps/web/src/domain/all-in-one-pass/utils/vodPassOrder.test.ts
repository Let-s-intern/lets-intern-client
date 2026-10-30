import { getOrderName } from '@/domain/program/vodPassPurchase';
import {
  buildMembershipApplicationBody,
  getMembershipOrderTotal,
  getMembershipOrderTotals,
} from './vodPassOrder';

const NO_VOD = {
  vodPassProductId: null,
  vodPassPrice: null,
  vodPassDurationDays: null,
  vodPassMonths: null,
};

const VOD_2_MONTHS = {
  vodPassProductId: 7,
  vodPassPrice: 30000,
  vodPassDurationDays: 60,
  vodPassMonths: 2,
};

const ORDER = {
  membershipPlanId: 1,
  price: 100000,
  discount: 10000,
  couponPrice: 0,
  couponCode: null,
  contactEmail: 'a@b.com',
  isFree: false,
};

describe('올인원패스 결제 금액', () => {
  it('쿠폰은 패스 금액에만 빼고 VOD 금액은 그 뒤에 더한다', () => {
    const data = {
      ...ORDER,
      couponPrice: 20000,
      couponCode: 'C',
      ...VOD_2_MONTHS,
    };

    // max(100000 - 10000 - 20000, 0) + 30000
    expect(getMembershipOrderTotal(data)).toBe(100000);
  });

  it('쿠폰이 패스 금액보다 커서 패스가 0원이어도 VOD 금액은 그대로 결제한다', () => {
    const data = { ...ORDER, couponPrice: 200000, ...VOD_2_MONTHS };

    expect(getMembershipOrderTotals(data)).toEqual({
      totalPrice: 30000,
      isFree: false,
    });
  });

  it('VOD 를 고르지 않으면 이전 계산과 같고 0원이면 무료다', () => {
    expect(getMembershipOrderTotal({ ...ORDER, ...NO_VOD })).toBe(90000);
    expect(
      getMembershipOrderTotals({ ...ORDER, couponPrice: 90000, ...NO_VOD }),
    ).toEqual({ totalPrice: 0, isFree: true });
  });
});

describe('buildMembershipApplicationBody', () => {
  it('VOD 를 고르지 않으면 VOD 필드를 하나도 넣지 않는다', () => {
    const body = buildMembershipApplicationBody(
      { ...ORDER, ...NO_VOD },
      { orderId: 'order-1', paymentKey: 'pk' },
    );

    expect(body).toEqual({
      membershipPlanId: 1,
      orderId: 'order-1',
      amount: '90000',
      paymentKey: 'pk',
      couponCode: null,
      contactEmail: 'a@b.com',
    });
    expect(Object.keys(body).some((key) => key.startsWith('vodPass'))).toBe(
      false,
    );
  });

  it('VOD 를 고르면 네 필드와 합산 금액을 보낸다', () => {
    const body = buildMembershipApplicationBody(
      { ...ORDER, couponPrice: 200000, couponCode: 'C', ...VOD_2_MONTHS },
      { orderId: 'order-1', paymentKey: 'pk' },
    );

    expect(body).toMatchObject({
      amount: '30000',
      paymentKey: 'pk',
      couponCode: 'C',
      vodPassProductId: 7,
      vodPassExpectedPrice: 30000,
      vodPassExpectedDurationDays: 60,
      vodPassMonths: 2,
    });
  });

  it('무료 주문은 paymentKey 를 보내지 않는다', () => {
    const body = buildMembershipApplicationBody(
      { ...ORDER, couponPrice: 90000, isFree: true, ...NO_VOD },
      { orderId: 'order-1', paymentKey: 'pk' },
    );

    expect(body.paymentKey).toBeNull();
    expect(body.amount).toBe('0');
  });
});

describe('올인원패스 주문명', () => {
  it('VOD 를 담으면 접미어를 붙이고 100자를 넘지 않는다', () => {
    const longTitle = '가'.repeat(120);
    const name = getOrderName(longTitle, VOD_2_MONTHS);

    expect(name.length).toBe(100);
    expect(name.endsWith(' + VOD 이용권')).toBe(true);
  });

  it('VOD 를 담지 않으면 패스 이름 그대로다', () => {
    expect(getOrderName('올인원패스', NO_VOD)).toBe('올인원패스');
  });
});
