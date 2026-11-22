import { buildPlanOptions } from './planOptions';

const price = (
  plan: 'LIGHT' | 'BASIC' | 'STANDARD' | 'PREMIUM' | null,
  extra: Record<string, unknown> = {},
) => ({
  priceId: 1,
  challengePricePlanType: plan,
  challengeOptionList: [],
  ...extra,
});

describe('buildPlanOptions', () => {
  it('챌린지에 있는 플랜만 라이트 → 프리미엄 순으로, 할인율과 판매가를 낸다', () => {
    const options = buildPlanOptions(
      [
        price('BASIC', { price: 50000, refund: 20000, discount: 25000 }),
        price('PREMIUM', {
          challengeOptionList: [{ price: 30000, discountPrice: 10000 }],
        }),
      ] as never,
      null,
    );
    expect(options.map((o) => o.plan)).toEqual(['BASIC', 'PREMIUM']);
    expect(options[0]).toMatchObject({
      title: '베이직 플랜',
      regularPrice: 70000,
      sellingPrice: 45000,
      discountPercentage: 36,
      passPrice: null,
    });
    expect(options[1]).toMatchObject({
      regularPrice: 100000,
      sellingPrice: 65000,
    });
  });

  it('패스 회원가가 있으면 플랜별로 붙이고, 어드민 플랜 이름을 쓴다', () => {
    const options = buildPlanOptions(
      [price('BASIC', { price: 10000, title: '챌린지 기본' })] as never,
      { BASIC: 0 },
    );
    expect(options[0]).toMatchObject({ title: '챌린지 기본', passPrice: 0 });
  });

  it('플랜 구분이 없는 예전 챌린지는 첫 가격을 베이직으로 본다', () => {
    const options = buildPlanOptions(
      [price(null, { price: 30000 })] as never,
      null,
    );
    expect(options).toHaveLength(1);
    expect(options[0]).toMatchObject({ plan: 'BASIC', sellingPrice: 30000 });
  });
});
