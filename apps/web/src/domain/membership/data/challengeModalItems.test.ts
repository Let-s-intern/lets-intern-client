import { challengeTypeSchema } from '@/schema';
import {
  CHALLENGE_ITEMS,
  getChallengeThumbnailSrc,
} from './challengeModalItems';

describe('CHALLENGE_ITEMS', () => {
  it('챌린지 10종을 core 7종 + job 3종으로 담는다', () => {
    expect(CHALLENGE_ITEMS).toHaveLength(10);
    expect(CHALLENGE_ITEMS.filter((i) => i.group === 'core')).toHaveLength(7);
    expect(CHALLENGE_ITEMS.filter((i) => i.group === 'job')).toHaveLength(3);
  });

  it('모든 url 이 /challenge/ 로 시작해 /latest 로 끝난다 (챌린지 id 하드코딩 금지)', () => {
    for (const item of CHALLENGE_ITEMS) {
      expect(item.url.startsWith('/challenge/')).toBe(true);
      expect(item.url.endsWith('/latest')).toBe(true);
      expect(item.url).not.toMatch(/\/program\/challenge\/\d/);
    }
  });

  it('모든 항목에 비어 있지 않은 desc 와 배지 2개가 있다', () => {
    for (const item of CHALLENGE_ITEMS) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.desc.length).toBeGreaterThan(0);
      expect(item.badges).toHaveLength(2);
      expect(item.badges).toEqual([
        '베이직 무료 참여',
        '플랜 업그레이드 시 차액 결제',
      ]);
    }
  });

  it('모든 challengeType 이 challengeTypeSchema 를 통과하고 서로 겹치지 않는다', () => {
    for (const item of CHALLENGE_ITEMS) {
      expect(() => challengeTypeSchema.parse(item.challengeType)).not.toThrow();
    }
    const types = CHALLENGE_ITEMS.map((i) => i.challengeType);
    expect(new Set(types).size).toBe(types.length);
  });

  it('인적성 챌린지가 ETC 타입으로 포함돼 있다', () => {
    const aptitude = CHALLENGE_ITEMS.find((i) => i.challengeType === 'ETC');
    expect(aptitude).toBeDefined();
    expect(aptitude?.url).toBe('/challenge/aptitude/latest');
    expect(aptitude?.src).toBe('challenge-aptitude.webp');
  });

  it('getChallengeThumbnailSrc 가 정적 이미지 경로를 만든다', () => {
    expect(getChallengeThumbnailSrc(CHALLENGE_ITEMS[0])).toBe(
      `/images/membership/${CHALLENGE_ITEMS[0].src}`,
    );
  });

  it('어드민 썸네일이 있으면 그것을 쓴다', () => {
    // 링크는 최신 기수(`/latest`)로 가는데 이미지가 정적이면, 표지에 찍힌 기수 번호와
    // 실제로 열리는 기수가 어긋난다. 13기로 가는 카드에 2기 표지가 붙어 있었다.
    const remote = 'https://letsintern-bucket.s3.amazonaws.com/a.png';
    expect(getChallengeThumbnailSrc(CHALLENGE_ITEMS[0], remote)).toBe(remote);
  });

  it('빈 문자열은 썸네일 없음으로 보고 정적 파일로 되돌린다', () => {
    // 어드민에서 썸네일을 지우면 빈 문자열이 올 수 있다. 그대로 쓰면 이미지가 깨진 채
    // 렌더된다 — 카드가 비어 보이는 것보다 지난 기수 표지라도 나오는 편이 낫다.
    expect(getChallengeThumbnailSrc(CHALLENGE_ITEMS[0], '')).toBe(
      `/images/membership/${CHALLENGE_ITEMS[0].src}`,
    );
  });
});
