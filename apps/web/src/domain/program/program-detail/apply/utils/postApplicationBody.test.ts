import { buildPostApplicationBody } from './postApplicationBody';

type FormData = Parameters<typeof buildPostApplicationBody>[0];

const FORM: FormData = {
  priceId: 10,
  price: 100000,
  discount: 10000,
  couponId: '7',
  couponPrice: 5000,
  totalPrice: 85000,
  contactEmail: 'user@example.com',
  question: '질문',
  email: 'user@example.com',
  phone: '010-0000-0000',
  name: '참여자',
  programTitle: '챌린지',
  programType: 'challenge',
  progressType: 'none',
  programId: 1,
  programOrderId: 'order-1',
  isFree: false,
  deposit: 0,
  challengeVersionId: null,
};

const PAID_PARAMS = { orderId: 'order-1', paymentKey: 'pk_1', amount: 85000 };

describe('buildPostApplicationBody', () => {
  it('버전을 고른 신청은 그 버전 id 를 싣는다', () => {
    const body = buildPostApplicationBody(
      { ...FORM, challengeVersionId: 3 },
      PAID_PARAMS,
    );

    expect(body.challengeVersionId).toBe(3);
  });

  it('LIGHT 신청은 신청 입력이 null 로 저장하므로 null 을 싣는다', () => {
    const body = buildPostApplicationBody(
      { ...FORM, challengeVersionId: null },
      PAID_PARAMS,
    );

    expect(body.challengeVersionId).toBeNull();
  });

  it('버전 없는 챌린지는 null 을 싣는다 (배포 전에 저장돼 키가 없는 폼 포함)', () => {
    const { challengeVersionId: _omitted, ...legacyForm } = FORM;

    const body = buildPostApplicationBody(legacyForm as FormData, PAID_PARAMS);

    expect(body).toHaveProperty('challengeVersionId', null);
  });

  it('유료 결제는 토스가 돌려준 결제 키와 금액을 싣는다', () => {
    expect(buildPostApplicationBody(FORM, PAID_PARAMS)).toEqual({
      paymentInfo: {
        couponId: 7,
        priceId: 10,
        paymentKey: 'pk_1',
        orderId: 'order-1',
        amount: '85000',
      },
      contactEmail: 'user@example.com',
      motivate: '',
      question: '질문',
      challengeVersionId: null,
    });
  });

  it('무료 신청은 결제 키 없이 폼의 결제 금액을 싣는다', () => {
    const body = buildPostApplicationBody(
      { ...FORM, isFree: true, couponId: '', totalPrice: 0 },
      { orderId: 'order-1' },
    );

    expect(body.paymentInfo).toEqual({
      couponId: null,
      priceId: 10,
      paymentKey: null,
      orderId: 'order-1',
      amount: '0',
    });
  });
});
