import { describe, expect, it } from 'vitest';

import { toYoutubeEmbedUrl } from '../../constants';

/**
 * 서버(`LiveMentoringUrlPolicy`)는 `https://www.youtube.com/embed/{id}` 만 받는다.
 * 쿼리 하나만 붙어도 상세 페이지 저장 전체가 400 이 되므로, 흔한 공유 링크 형태를
 * 빠짐없이 변환하는지 고정한다.
 */
describe('toYoutubeEmbedUrl', () => {
  const EMBED = 'https://www.youtube.com/embed/rlmvx1Ayg0s';

  it('공유 링크(youtu.be + si 쿼리)를 embed 로 바꾼다', () => {
    expect(
      toYoutubeEmbedUrl('https://youtu.be/rlmvx1Ayg0s?si=jqUWz57UsFgGZhId'),
    ).toBe(EMBED);
  });

  it('watch 링크를 embed 로 바꾼다', () => {
    expect(
      toYoutubeEmbedUrl('https://www.youtube.com/watch?v=rlmvx1Ayg0s&t=10s'),
    ).toBe(EMBED);
  });

  it('embed 주소에 붙은 쿼리를 떼어낸다', () => {
    expect(toYoutubeEmbedUrl(`${EMBED}?si=abc`)).toBe(EMBED);
  });

  it('shorts 와 m.youtube.com 도 받는다', () => {
    expect(
      toYoutubeEmbedUrl('https://www.youtube.com/shorts/rlmvx1Ayg0s'),
    ).toBe(EMBED);
    expect(toYoutubeEmbedUrl('https://m.youtube.com/watch?v=rlmvx1Ayg0s')).toBe(
      EMBED,
    );
  });

  it('이미 정규화된 주소는 그대로 둔다', () => {
    expect(toYoutubeEmbedUrl(EMBED)).toBe(EMBED);
  });

  it('YouTube 가 아니거나 형식이 깨졌으면 null', () => {
    expect(toYoutubeEmbedUrl('https://vimeo.com/12345')).toBeNull();
    expect(toYoutubeEmbedUrl('그냥 텍스트')).toBeNull();
    expect(toYoutubeEmbedUrl('')).toBeNull();
    expect(toYoutubeEmbedUrl('https://www.youtube.com/')).toBeNull();
  });
});
