import { buildPurchasePath } from './purchasePath';

describe('buildPurchasePath', () => {
  it('구매 화면 경로를 만든다', () => {
    expect(buildPurchasePath({ guidebookId: 12 })).toBe(
      '/guidebook/purchase/12',
    );
  });

  it('결과·실패 화면 경로에 쿼리와 returnUrl 을 이어 붙인다', () => {
    const path = buildPurchasePath({
      guidebookId: 12,
      step: 'result',
      returnUrl: 'https://ogonggo.co.kr/reports/fnb',
      params: { priceId: '7' },
    });
    const url = new URL(path, 'https://x.test');

    expect(url.pathname).toBe('/guidebook/purchase/12/result');
    expect(url.searchParams.get('priceId')).toBe('7');
    expect(url.searchParams.get('returnUrl')).toBe(
      'https://ogonggo.co.kr/reports/fnb',
    );
  });

  it('returnUrl 이 없으면 붙이지 않는다', () => {
    expect(buildPurchasePath({ guidebookId: 12, step: 'fail' })).toBe(
      '/guidebook/purchase/12/fail',
    );
  });
});
