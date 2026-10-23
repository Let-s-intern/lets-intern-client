import {
  planUpgradePaymentTitle,
  sumPlanUpgradeAmount,
} from './planUpgradePayment';

const PAYMENT = {
  fromPlan: 'BASIC',
  toPlan: 'PREMIUM',
  additionalAmount: 2000,
  paidAt: '2026-09-14T14:38:59',
};

describe('planUpgradePayment (LC-3247 결제 상세 추가 결제)', () => {
  it('추가 결제 금액을 모두 더한다', () => {
    expect(sumPlanUpgradeAmount([])).toBe(0);
    expect(
      sumPlanUpgradeAmount([
        PAYMENT,
        { ...PAYMENT, fromPlan: 'STANDARD', additionalAmount: 1000 },
      ]),
    ).toBe(3000);
  });

  it('바뀐 플랜을 한글 이름으로 보여 준다', () => {
    expect(planUpgradePaymentTitle(PAYMENT)).toBe(
      '플랜 업그레이드 (베이직 → 프리미엄)',
    );
  });
});
