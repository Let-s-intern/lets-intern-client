describe('VOD_SITE_URL', () => {
  const original = process.env.NEXT_PUBLIC_VOD_SITE_URL;

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_VOD_SITE_URL;
    else process.env.NEXT_PUBLIC_VOD_SITE_URL = original;
    jest.resetModules();
  });

  it('환경변수가 없으면 운영 VOD 사이트 주소를 쓴다', async () => {
    delete process.env.NEXT_PUBLIC_VOD_SITE_URL;
    const { VOD_SITE_URL, VOD_SITE_LIST_URL } = await import('./vodSiteUrl');

    expect(VOD_SITE_URL).toBe('https://vod.letscareer.co.kr');
    expect(VOD_SITE_LIST_URL).toBe('https://vod.letscareer.co.kr/vod');
  });

  it('환경변수가 있으면 그 주소를 쓰고 끝의 슬래시는 뗀다', async () => {
    process.env.NEXT_PUBLIC_VOD_SITE_URL = 'https://test-vod.example.com/';
    const { VOD_SITE_LIST_URL } = await import('./vodSiteUrl');

    expect(VOD_SITE_LIST_URL).toBe('https://test-vod.example.com/vod');
  });
});
