import { describe, expect, it } from 'vitest';

import { marketingAgreeStat } from './marketingAgreeStat';

describe('marketingAgreeStat', () => {
  it('빈 입력은 total/agreed/percent 모두 0', () => {
    expect(marketingAgreeStat([])).toEqual({
      total: 0,
      agreed: 0,
      percent: 0,
    });
  });

  it('4건 중 3건 동의는 percent 75', () => {
    expect(
      marketingAgreeStat([
        { marketingAgree: true },
        { marketingAgree: true },
        { marketingAgree: true },
        { marketingAgree: false },
      ]),
    ).toEqual({ total: 4, agreed: 3, percent: 75 });
  });

  it('전원 동의는 percent 100', () => {
    expect(
      marketingAgreeStat([{ marketingAgree: true }, { marketingAgree: true }]),
    ).toEqual({ total: 2, agreed: 2, percent: 100 });
  });

  it('전원 미동의는 percent 0', () => {
    expect(
      marketingAgreeStat([
        { marketingAgree: false },
        { marketingAgree: false },
        { marketingAgree: false },
      ]),
    ).toEqual({ total: 3, agreed: 0, percent: 0 });
  });
});
