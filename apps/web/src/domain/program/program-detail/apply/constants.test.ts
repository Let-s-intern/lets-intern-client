import { getBlockedCouponCodes } from './constants';

describe('getBlockedCouponCodes (LC-3611)', () => {
  it('경험정리 결제에서는 YAIREWARD 를 막지 않는다', () => {
    expect(getBlockedCouponCodes('EXPERIENCE_SUMMARY')).not.toContain(
      'YAIREWARD',
    );
  });

  it('다른 챌린지 결제에서는 YAIREWARD 를 막는다', () => {
    expect(getBlockedCouponCodes('PORTFOLIO')).toContain('YAIREWARD');
  });

  it('챌린지 타입을 모르면 묶인 코드를 전부 막는다', () => {
    expect(getBlockedCouponCodes('')).toContain('YAIREWARD');
  });
});
