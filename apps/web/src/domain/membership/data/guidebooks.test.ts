import {
  GUIDEBOOK_CARD,
  GUIDEBOOK_ITEMS,
  STUDY_CARD,
  STUDY_DETAIL_URL,
} from './guidebooks';

describe('GUIDEBOOK_ITEMS', () => {
  it('표지가 수급된 가이드북 항목을 담는다', () => {
    expect(GUIDEBOOK_ITEMS.length).toBeGreaterThan(0);
    for (const item of GUIDEBOOK_ITEMS) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.src.length).toBeGreaterThan(0);
    }
  });

  it('모든 url 이 가이드북 상세 경로를 가리킨다', () => {
    for (const item of GUIDEBOOK_ITEMS) {
      expect(item.url).toContain('/program/guidebook/');
      expect(() => new URL(item.url)).not.toThrow();
    }
  });
});

describe('STUDY_DETAIL_URL', () => {
  it('유효한 URL 이다', () => {
    expect(() => new URL(STUDY_DETAIL_URL)).not.toThrow();
    expect(new URL(STUDY_DETAIL_URL).host).toBe('www.letscareer.co.kr');
  });
});

describe('혜택 카드 문구', () => {
  it('가이드북 카드에 제목·설명·열람 기한 배지·링크가 있다', () => {
    expect(GUIDEBOOK_CARD.title).toBe('가이드북');
    expect(GUIDEBOOK_CARD.desc.length).toBeGreaterThan(0);
    expect(GUIDEBOOK_CARD.badges).toEqual(['11/30까지 열람 가능']);
    expect(GUIDEBOOK_CARD.url).toContain('/program/guidebook/');
    expect(GUIDEBOOK_CARD.imgAlt.length).toBeGreaterThan(0);
  });

  it('스터디 카드에 제목·설명·배지 2종·상세 링크가 있다', () => {
    expect(STUDY_CARD.title).toBe('렛츠런 스터디');
    expect(STUDY_CARD.desc.length).toBeGreaterThan(0);
    expect(STUDY_CARD.badges).toEqual(['무료 참여', '페이백 불가']);
    expect(STUDY_CARD.url).toBe(STUDY_DETAIL_URL);
  });
});
