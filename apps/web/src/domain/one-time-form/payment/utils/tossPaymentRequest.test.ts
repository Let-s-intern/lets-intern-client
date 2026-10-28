import { paidFormFixture } from '../../__fixtures__/oneTimeFormFixtures';
import { buildTossPaymentRequest } from './tossPaymentRequest';

const DRAFT = {
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
  selectedOptionIds: [311, 321],
  answers: {},
  orderId: 'letsXk29Pq8812',
  amount: 49000,
};

describe('buildTossPaymentRequest', () => {
  it('계약 11.3 값으로 만든다', () => {
    expect(
      buildTossPaymentRequest({
        origin: 'https://www.letscareer.co.kr',
        slug: 'portfolio-1115',
        form: paidFormFixture.form,
        draft: DRAFT,
        orderId: 'letsXk29Pq8812',
      }),
    ).toEqual({
      orderId: 'letsXk29Pq8812',
      orderName: '포트폴리오 집중 클래스',
      successUrl:
        'https://www.letscareer.co.kr/form/portfolio-1115/payment/result',
      failUrl: 'https://www.letscareer.co.kr/form/portfolio-1115/payment',
      customerName: '김렛커',
      customerEmail: 'letscareer@example.com',
      customerMobilePhone: '01012345678',
    });
  });

  it('결제 화면 상품명이 없으면 폼 제목이 주문명이다', () => {
    const request = buildTossPaymentRequest({
      origin: 'https://www.letscareer.co.kr',
      slug: 'portfolio-1115',
      form: { ...paidFormFixture.form, paymentProductName: null },
      draft: DRAFT,
      orderId: 'letsXk29Pq8812',
    });

    expect(request.orderName).toBe('현직자와 함께하는 포트폴리오 집중 클래스');
  });
});
