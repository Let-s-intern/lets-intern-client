import type { OneTimeFormDraft } from '../../utils/applicationDraft';
import { buildCreateApplicationRequest } from './buildCreateApplicationRequest';

const DRAFT: OneTimeFormDraft = {
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
  selectedOptionIds: [311, 321],
  answers: {
    '101': '프론트엔드',
    '103': ['월', '수'],
    '110': {
      key: 'one-time-form/attachment/7/0b5c2f4e-9a61-4d1e-8f0a-3c2b7d9e1a44.pdf',
      name: '김렛커_이력서_최종.pdf',
    },
  },
  orderId: 'letsXk29Pq8812',
  amount: 49000,
};

const UTM = {
  utmSource: 'instagram',
  utmMedium: 'paid',
  utmCampaign: 'portfolio_1115',
  utmContent: 'story_a',
  utmTerm: null,
  referrer: 'https://event-xxx.vercel.app/',
};

describe('buildCreateApplicationRequest', () => {
  it('유료 결제는 계약 U3 예시 형태 그대로 만든다', () => {
    expect(
      buildCreateApplicationRequest(DRAFT, UTM, {
        paymentKey: 'tgen_20261102132355abcd',
        orderId: 'letsXk29Pq8812',
        amount: 49000,
      }),
    ).toEqual({
      name: '김렛커',
      email: 'letscareer@example.com',
      phoneNum: '010-1234-5678',
      selectedOptionIds: [311, 321],
      answers: DRAFT.answers,
      utmSource: 'instagram',
      utmMedium: 'paid',
      utmCampaign: 'portfolio_1115',
      utmContent: 'story_a',
      utmTerm: null,
      referrer: 'https://event-xxx.vercel.app/',
      payment: {
        paymentKey: 'tgen_20261102132355abcd',
        orderId: 'letsXk29Pq8812',
        amount: 49000,
      },
    });
  });

  it('0원은 paymentKey null, amount 0 이고 보관한 UTM 이 없으면 UTM 은 모두 null 이다', () => {
    const draft = {
      ...DRAFT,
      selectedOptionIds: [911],
      answers: {},
      amount: 0,
    };
    const request = buildCreateApplicationRequest(draft, null, {
      paymentKey: null,
      orderId: 'letsZERO0001',
      amount: 0,
    });

    expect(request).toEqual({
      name: '김렛커',
      email: 'letscareer@example.com',
      phoneNum: '010-1234-5678',
      selectedOptionIds: [911],
      answers: {},
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
      referrer: null,
      payment: { paymentKey: null, orderId: 'letsZERO0001', amount: 0 },
    });
  });

  it('보관값의 orderId·amount 는 요청 본문에 넣지 않는다(결제 정보에만 들어간다)', () => {
    const request = buildCreateApplicationRequest(DRAFT, UTM, {
      paymentKey: 'tgen_1',
      orderId: 'letsXk29Pq8812',
      amount: 49000,
    });

    expect(request).not.toHaveProperty('orderId');
    expect(request).not.toHaveProperty('amount');
  });
});
