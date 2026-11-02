import { getYoutubeVideoId } from './youtube';

const ID = 'dQw4w9WgXcQ';

describe('getYoutubeVideoId', () => {
  it.each([
    `https://www.youtube.com/watch?v=${ID}`,
    `https://www.youtube.com/watch?list=abc&v=${ID}`,
    `https://youtu.be/${ID}?si=share`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/live/${ID}`,
  ])('%s 에서 영상 ID 를 뽑는다', (url) => {
    expect(getYoutubeVideoId(url)).toBe(ID);
  });

  it.each(['', 'https://letscareer.co.kr'])(
    '유튜브 주소가 아니면 null 이다: %s',
    (url) => {
      expect(getYoutubeVideoId(url)).toBeNull();
    },
  );
});
