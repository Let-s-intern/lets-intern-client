import { buildFreeApplicationRequest } from './buildFreeApplicationRequest';

const REQUEST = {
  name: '이유저',
  email: 'user@example.com',
  phoneNum: '010-1111-2222',
  selectedOptionIds: [999],
  answers: { '201': '포트폴리오 첨삭 사례가 궁금해요.' },
};

describe('buildFreeApplicationRequest', () => {
  it('결제는 null, 옵션은 [] 로 보내고 보관한 UTM 을 붙인다', () => {
    expect(
      buildFreeApplicationRequest(REQUEST, {
        utmSource: 'instagram',
        utmMedium: 'paid',
        utmCampaign: 'seminar_1130',
        utmContent: null,
        utmTerm: null,
        referrer: 'https://event-xxx.vercel.app/',
      }),
    ).toEqual({
      name: '이유저',
      email: 'user@example.com',
      phoneNum: '010-1111-2222',
      selectedOptionIds: [],
      answers: { '201': '포트폴리오 첨삭 사례가 궁금해요.' },
      utmSource: 'instagram',
      utmMedium: 'paid',
      utmCampaign: 'seminar_1130',
      utmContent: null,
      utmTerm: null,
      referrer: 'https://event-xxx.vercel.app/',
      payment: null,
    });
  });

  it('보관한 UTM 이 없으면 UTM 과 referrer 를 모두 null 로 보낸다', () => {
    expect(buildFreeApplicationRequest(REQUEST, null)).toMatchObject({
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
      referrer: null,
      payment: null,
    });
  });
});
