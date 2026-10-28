import { isRateLimited } from './isRateLimited';

describe('isRateLimited', () => {
  it('status 429 만 빈도 제한으로 본다', () => {
    expect(isRateLimited({ status: 429 })).toBe(true);
    expect(isRateLimited({ status: 400 })).toBe(false);
    expect(isRateLimited(null)).toBe(false);
  });
});
