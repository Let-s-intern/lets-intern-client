import {
  GUIDEBOOK_CARD,
  GUIDEBOOK_ITEMS,
  guidebookUrl,
  STUDY_CARD,
  STUDY_DETAIL_URL,
} from './guidebooks';

describe('GUIDEBOOK_ITEMS', () => {
  it('표지와 가이드북 ID 를 모두 갖는다', () => {
    expect(GUIDEBOOK_ITEMS.length).toBeGreaterThan(0);
    for (const item of GUIDEBOOK_ITEMS) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.src.length).toBeGreaterThan(0);
      expect(Number.isInteger(item.id)).toBe(true);
      expect(item.id).toBeGreaterThan(0);
    }
  });

  it('두 카드가 같은 가이드북을 가리키지 않는다', () => {
    // 대기업 자소서 카드가 자기소개서 가이드북(5)을, 인적성 카드가 면접 가이드북(9)을
    // 가리키고 있었다. 전용 가이드북 ID 를 못 찾아 주제가 비슷한 주소로 채운 것이
    // 남은 것인데, 404 가 아니라 "그럴싸한 다른 문서" 가 열려서 오래 눈에 띄지 않았다.
    // 중복 자체를 막으면 같은 방식으로 다시 채우는 것을 여기서 잡는다.
    const ids = GUIDEBOOK_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('대기업 자소서·인적성이 전용 가이드북을 가리킨다', () => {
    // 이 두 장이 위 중복의 당사자였다. 값을 못으로 박아 되돌아가는 것을 막는다.
    const find = (keyword: string) =>
      GUIDEBOOK_ITEMS.find((item) => item.label.includes(keyword));
    expect(find('대기업 자소서')?.id).toBe(15);
    expect(find('인적성')?.id).toBe(14);
  });

  it('표지 폴백이 챌린지 표지가 아니라 가이드북 표지다', () => {
    // 전용 표지가 없던 동안 두 카드는 같은 주제의 챌린지 표지를 빌려 썼다. 그 그림에는
    // 기수 번호가 찍혀 있어서, 13기로 가는 카드에 2기 표지가 붙는 일이 실제로 났다.
    for (const item of GUIDEBOOK_ITEMS) {
      expect(item.src.startsWith('challenge-')).toBe(false);
    }
  });
});

describe('guidebookUrl', () => {
  it('앱 내부 상대경로를 만든다', () => {
    // 절대 URL 이면 dev·로컬에서 눌러도 프로덕션으로 나가버려 작업 중 화면을 못 본다.
    expect(guidebookUrl(15)).toBe('/program/guidebook/15');
    expect(guidebookUrl(15).startsWith('/')).toBe(true);
  });

  it('제목 슬러그를 붙이지 않는다', () => {
    // 서버가 ID 만으로 정식 제목 경로로 리다이렉트한다. 슬러그를 적어 두면 운영에서
    // 제목을 바꿀 때마다 낡는데, 링크가 죽지 않고 리다이렉트돼서 티가 안 난다.
    expect(guidebookUrl(14)).toBe('/program/guidebook/14');
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
