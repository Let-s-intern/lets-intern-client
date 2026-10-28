import { paidFormFixture } from '../../__fixtures__/oneTimeFormFixtures';
import { buildPaymentAmountSummary, formatWon } from './paymentAmount';

describe('buildPaymentAmountSummary', () => {
  it('신청 1042: 기본 29,000 + 온라인 라이브 0 + 1:1 첨삭 20,000 = 49,000', () => {
    expect(buildPaymentAmountSummary(paidFormFixture, [311, 321])).toEqual({
      productName: '포트폴리오 집중 클래스',
      basePrice: 29000,
      optionLines: [
        {
          optionGroupId: 31,
          groupTitle: '참여 방식을 골라 주세요',
          optionId: 311,
          optionName: '온라인 라이브',
          additionalPrice: 0,
        },
        {
          optionGroupId: 32,
          groupTitle: '함께 신청하면 좋아요',
          optionId: 321,
          optionName: '포트폴리오 1:1 첨삭',
          additionalPrice: 20000,
        },
      ],
      totalPrice: 49000,
    });
  });

  it('줄은 고른 순서가 아니라 그룹·옵션 순서이고, 폼에 없는 옵션은 줄과 합계에서 뺀다', () => {
    const summary = buildPaymentAmountSummary(paidFormFixture, [322, 312, 999]);

    expect(summary.optionLines.map((line) => line.optionId)).toEqual([
      312, 322,
    ]);
    expect(summary.totalPrice).toBe(29000 + 10000 + 5000);
  });

  it('결제 화면 상품명이 없으면 폼 제목을 쓴다', () => {
    const summary = buildPaymentAmountSummary(
      {
        ...paidFormFixture,
        form: { ...paidFormFixture.form, paymentProductName: null },
      },
      [],
    );

    expect(summary.productName).toBe(
      '현직자와 함께하는 포트폴리오 집중 클래스',
    );
    expect(summary.optionLines).toEqual([]);
    expect(summary.totalPrice).toBe(29000);
  });
});

describe('formatWon', () => {
  it('천 단위 쉼표와 "원"을 붙인다', () => {
    expect(formatWon(49000)).toBe('49,000원');
    expect(formatWon(0)).toBe('0원');
  });
});
