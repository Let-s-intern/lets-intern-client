import { fetchOpenPassPath, withQuery } from './openPassPath';

const mockFetch = (body: unknown, ok = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: async () => body,
  }) as jest.Mock;
};

describe('fetchOpenPassPath', () => {
  it('열린 패스가 하나면 그 랜딩으로 보낸다', async () => {
    mockFetch({ data: { exists: true, membershipId: 1, openCount: 1 } });
    await expect(fetchOpenPassPath()).resolves.toBe('/all-in-one-pass/1');
  });

  it('열린 패스가 둘 이상이면 프로그램 목록으로 보낸다', async () => {
    mockFetch({ data: { exists: true, membershipId: 1, openCount: 2 } });
    await expect(fetchOpenPassPath()).resolves.toBe('/program?type=MEMBERSHIP');
  });

  it('열린 패스가 없으면 프로그램 목록으로 보낸다', async () => {
    mockFetch({ data: { exists: false, membershipId: null, openCount: 0 } });
    await expect(fetchOpenPassPath()).resolves.toBe('/program?type=MEMBERSHIP');
  });

  it('API 가 실패해도 프로그램 목록으로 보낸다', async () => {
    mockFetch({}, false);
    await expect(fetchOpenPassPath()).resolves.toBe('/program?type=MEMBERSHIP');

    global.fetch = jest.fn().mockRejectedValue(new Error('down')) as jest.Mock;
    await expect(fetchOpenPassPath()).resolves.toBe('/program?type=MEMBERSHIP');
  });
});

describe('withQuery', () => {
  it('들어온 쿼리를 붙인다', () => {
    expect(withQuery('/all-in-one-pass/1', { utm_source: 'ad' })).toBe(
      '/all-in-one-pass/1?utm_source=ad',
    );
  });

  it('경로에 이미 있는 쿼리를 지우지 않는다', () => {
    expect(
      withQuery('/program?type=MEMBERSHIP', { utm_source: ['a', 'b'] }),
    ).toBe('/program?type=MEMBERSHIP&utm_source=a&utm_source=b');
  });

  it('쿼리가 없으면 경로 그대로', () => {
    expect(withQuery('/all-in-one-pass/1', {})).toBe('/all-in-one-pass/1');
  });
});
