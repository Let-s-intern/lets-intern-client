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

  it('두 카드가 같은 주소를 쓰지 않는다', () => {
    // 대기업 자소서 카드가 자기소개서 가이드북(5)을, 인적성 카드가 면접 가이드북(9)을
    // 가리키고 있었다. 대응 자료가 없어 주제가 비슷한 주소로 임시로 채운 것이 남은
    // 것인데, 404 가 아니라 "그럴싸한 다른 문서" 가 열려서 오래 눈에 띄지 않았다.
    // 중복 자체를 막으면 같은 방식으로 다시 채우는 것을 여기서 잡는다.
    const urls = GUIDEBOOK_ITEMS.map((item) => item.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('kind 가 이름·주소와 어긋나지 않는다', () => {
    // kind 는 카드 하단 문구("가이드북/챌린지 자세히 보기")를 정한다. 이름은 챌린지인데
    // kind 가 guidebook 이면 문구만 조용히 틀린다.
    for (const item of GUIDEBOOK_ITEMS) {
      expect(item.kind).toBe(
        item.label.includes('챌린지') ? 'challenge' : 'guidebook',
      );
    }
  });

  it('가이드북은 가이드북 상세로, 챌린지는 기수가 박히지 않는 latest 경로로 간다', () => {
    // 챌린지는 기수가 계속 새로 열린다. 특정 기수 ID 를 적어 두면 다음 기수에 낡고,
    // 링크가 죽는 게 아니라 지난 기수를 계속 열어 주기 때문에 눈에 띄지 않는다.
    for (const item of GUIDEBOOK_ITEMS) {
      if (item.kind === 'challenge') {
        expect(item.url).toMatch(/^\/challenge\/[a-z-]+\/latest$/);
      } else {
        expect(item.url).toContain('/program/guidebook/');
      }
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
    // 카드가 6종을 소개하므로 개별 상세가 아니라 목록으로 보낸다.
    // 앱 내부 상대경로여야 dev·로컬에서 프로덕션 도메인으로 새지 않는다.
    expect(GUIDEBOOK_CARD.url).toBe('/program?type=GUIDEBOOK');
    expect(GUIDEBOOK_CARD.url.startsWith('/')).toBe(true);
    expect(GUIDEBOOK_CARD.imgAlt.length).toBeGreaterThan(0);
  });

  it('스터디 카드에 제목·설명·배지 2종·상세 링크가 있다', () => {
    expect(STUDY_CARD.title).toBe('렛츠런 스터디');
    expect(STUDY_CARD.desc.length).toBeGreaterThan(0);
    expect(STUDY_CARD.badges).toEqual(['무료 참여', '페이백 불가']);
    expect(STUDY_CARD.url).toBe(STUDY_DETAIL_URL);
  });
});
