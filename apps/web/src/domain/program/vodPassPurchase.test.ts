import {
  calculateChallengeTotalWithVodPass,
  getOrderName,
  isVodPassSelected,
  toVodPassRequestFields,
} from './vodPassPurchase';

/** 이용권 도입 전 payment-input 의 합계식. 이용권 미선택 결과가 이와 같아야 한다. */
function legacyTotal(regularPrice: number, discount: number, coupon: number) {
  const totalDiscount = discount + coupon;
  return regularPrice <= totalDiscount ? 0 : regularPrice - totalDiscount;
}

describe('calculateChallengeTotalWithVodPass', () => {
  it('쿠폰 적용 뒤에 이용권 가격을 더한다 (쿠폰이 이용권을 깎지 않는다)', () => {
    // 서버: (100,000 - 10,000 - 20,000) + 29,000 = 99,000
    expect(
      calculateChallengeTotalWithVodPass({
        regularPrice: 100000,
        discount: 10000,
        couponPrice: 20000,
        vodPassPrice: 29000,
      }),
    ).toBe(99000);
  });

  it('쿠폰이 정가를 넘으면 챌린지 몫은 0 으로 막고 이용권만 남긴다', () => {
    // 이용권을 정가에 합쳐 계산하면 (100,000 + 29,000) - 150,000 = 0 이 되어 서버 amount 와 갈린다
    expect(
      calculateChallengeTotalWithVodPass({
        regularPrice: 100000,
        discount: 0,
        couponPrice: 150000,
        vodPassPrice: 29000,
      }),
    ).toBe(29000);
  });

  it('전액 쿠폰(챌린지 몫 0원)이어도 이용권 금액은 결제한다', () => {
    // 멤버십 무료 쿠폰 사용자: 프론트 0원·서버 이용권 금액 불일치가 나던 경우
    expect(
      calculateChallengeTotalWithVodPass({
        regularPrice: 169000,
        discount: 0,
        couponPrice: 169000,
        vodPassPrice: 29000,
      }),
    ).toBe(29000);
  });

  it('이용권을 고르지 않으면 기존 계산식과 같다', () => {
    const cases: [number, number, number][] = [
      [100000, 10000, 20000],
      [100000, 0, 0],
      [100000, 10000, 90000],
      [100000, 10000, 150000],
      [0, 0, 0],
    ];

    for (const [regularPrice, discount, couponPrice] of cases) {
      expect(
        calculateChallengeTotalWithVodPass({
          regularPrice,
          discount,
          couponPrice,
          vodPassPrice: 0,
        }),
      ).toBe(legacyTotal(regularPrice, discount, couponPrice));
    }
  });

  it('이용권 가격이 undefined·null 이어도 NaN 이 되지 않는다', () => {
    // persist 된 이전 상태는 vodPassPrice 가 undefined 로 복원된다
    expect(
      calculateChallengeTotalWithVodPass({
        regularPrice: 100000,
        discount: 10000,
        couponPrice: 0,
        vodPassPrice: undefined,
      }),
    ).toBe(90000);
    expect(
      calculateChallengeTotalWithVodPass({
        regularPrice: 100000,
        discount: null,
        couponPrice: null,
        vodPassPrice: null,
      }),
    ).toBe(100000);
  });

  it('쿠폰 없이 이용권만 더하면 정가 - 할인 + 이용권이다', () => {
    expect(
      calculateChallengeTotalWithVodPass({
        regularPrice: 100000,
        discount: 10000,
        couponPrice: 0,
        vodPassPrice: 29000,
      }),
    ).toBe(119000);
  });
});

describe('isVodPassSelected', () => {
  it('상품 ID 가 양수일 때만 선택으로 본다', () => {
    expect(isVodPassSelected({ vodPassProductId: 7 })).toBe(true);
    expect(isVodPassSelected({ vodPassProductId: 0 })).toBe(false);
    expect(isVodPassSelected({ vodPassProductId: null })).toBe(false);
    expect(isVodPassSelected({})).toBe(false);
  });
});

describe('toVodPassRequestFields', () => {
  it('선택했으면 서버가 요구하는 이름의 필드 세 개로 변환한다', () => {
    expect(
      toVodPassRequestFields({
        vodPassProductId: 7,
        vodPassPrice: 29000,
        vodPassDurationDays: 30,
      }),
    ).toEqual({
      vodPassProductId: 7,
      vodPassExpectedPrice: 29000,
      vodPassExpectedDurationDays: 30,
    });
  });

  it('미선택이면 필드를 하나도 내보내지 않는다', () => {
    expect(
      toVodPassRequestFields({
        vodPassProductId: 0,
        vodPassPrice: 0,
        vodPassDurationDays: 0,
      }),
    ).toEqual({});
    expect(toVodPassRequestFields({})).toEqual({});
  });

  it('요청 본문에 펼쳐도 미선택이면 키가 생기지 않는다', () => {
    const body = { amount: '100000', ...toVodPassRequestFields({}) };

    expect(Object.keys(body)).toEqual(['amount']);
  });
});

describe('getOrderName', () => {
  it('이용권을 고르지 않으면 프로그램 이름 그대로다', () => {
    expect(getOrderName('QA 챌린지', { vodPassProductId: 0 })).toBe(
      'QA 챌린지',
    );
    expect(getOrderName('QA 챌린지', {})).toBe('QA 챌린지');
  });

  it('이용권을 골랐으면 이름 뒤에 + VOD 이용권 을 붙인다', () => {
    expect(getOrderName('QA 챌린지', { vodPassProductId: 7 })).toBe(
      'QA 챌린지 + VOD 이용권',
    );
  });

  it('이름이 없어도 깨지지 않는다', () => {
    expect(getOrderName(null, {})).toBe('');
    expect(getOrderName(undefined, { vodPassProductId: 7 })).toBe(
      ' + VOD 이용권',
    );
  });

  it('이용권을 붙여도 Toss 주문명 100자를 넘지 않는다', () => {
    const longTitle = '가'.repeat(150);

    const withVod = getOrderName(longTitle, { vodPassProductId: 7 });

    expect(withVod.length).toBe(100);
    expect(withVod.endsWith(' + VOD 이용권')).toBe(true);
  });

  it('100자 이내 이름은 자르지 않는다', () => {
    const title = '가'.repeat(87);

    expect(getOrderName(title, { vodPassProductId: 7 })).toBe(
      `${title} + VOD 이용권`,
    );
  });
});
