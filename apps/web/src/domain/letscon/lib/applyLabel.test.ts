import { getApplyButtonLabel } from './applyLabel';

describe('getApplyButtonLabel', () => {
  it.each([
    ['available', '신청하기'],
    ['loading', '신청하기'],
    ['applied', '신청 완료'],
    ['closed', '신청 마감'],
    ['unavailable', '신청 준비 중'],
  ] as const)('%s 상태는 %s 로 보인다', (status, expected) => {
    expect(getApplyButtonLabel(status, '신청하기')).toBe(expected);
  });
});
