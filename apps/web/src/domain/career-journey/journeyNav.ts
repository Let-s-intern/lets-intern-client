/**
 * 취준 여정 메뉴. GNB "프로그램 카테고리" 와 홈 고민 섹션이 같은 구조를 쓴다.
 *
 * slug 는 두 곳에서 같은 값을 쓴다.
 * - 어드민 노출 분류의 필터용 카테고리 키: 거기에 "바로 갈 상품" 이 있으면 상세로 바로 간다
 * - 랜딩용 노출 목록 키: 바로 갈 상품이 없으면 /category/{slug} 랜딩으로 간다
 */
export interface JourneyItem {
  label: string;
  slug: string;
}

export interface JourneyGroup {
  /** 회색 제목. 누르지 않는다. 항목이 하나뿐이고 제목 없이 버튼만 보일 때는 null */
  label: string | null;
  items: JourneyItem[];
}

export const JOURNEY_GROUPS: JourneyGroup[] = [
  { label: '스펙 정리', items: [{ label: '경험정리', slug: 'experience' }] },
  {
    label: '서류 작성',
    items: [
      { label: '이력서', slug: 'resume' },
      { label: '자기소개서', slug: 'personal-statement' },
      { label: '포트폴리오', slug: 'portfolio' },
    ],
  },
  // 대기업은 세부 카테고리로 나누지 않고 랜딩 하나로 간다
  { label: null, items: [{ label: '대기업', slug: 'large-corp' }] },
  { label: '면접', items: [{ label: '면접', slug: 'interview' }] },
  {
    label: '직무특화',
    items: [
      { label: 'HR', slug: 'hr' },
      { label: '마케팅', slug: 'marketing' },
      { label: 'PM/PO', slug: 'pm' },
    ],
  },
];

/**
 * 상품 상세 주소. 제목을 모르면(메뉴의 바로 갈 상품) 제목 자리에 'detail' 을 넣는다.
 * 가이드북·자료집 상세는 id 로만 찾고 제목 조각은 보지 않는다.
 * 1:1 LIVE 멘토링은 멘토 id 로 열려, 멘토 id 가 없으면 멘토링 목록으로 보낸다
 */
export const getTargetHref = (
  type: string,
  id: number,
  { title, mentorId }: { title?: string; mentorId?: number | null } = {},
): string => {
  const slug = encodeURIComponent((title || 'detail').replace(/[ /]+/g, '-'));
  switch (type) {
    case 'CHALLENGE':
      return `/program/challenge/${id}`;
    case 'LIVE':
      return `/program/live/${id}`;
    case 'VOD':
      return `/program/vod/${id}`;
    case 'GUIDEBOOK':
      return `/program/guidebook/${id}/${slug}`;
    case 'MEMBERSHIP':
      return `/all-in-one-pass/${id}`;
    case 'BLOG':
      return `/blog/${id}`;
    case 'MAGNET':
      return `/library/${id}/${slug}`;
    case 'LIVE_MENTORING':
      return mentorId
        ? `/live-mentoring/${mentorId}`
        : '/program?catalog=mentoring';
    default:
      return '/program';
  }
};

export const getLandingHref = (slug: string) => `/category/${slug}`;
