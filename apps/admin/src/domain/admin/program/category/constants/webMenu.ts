/**
 * 웹 GNB "프로그램 카테고리" 메뉴와 홈 고민 섹션 카드. 웹에 고정된 구조라 여기도 같은 값을 둔다
 * (apps/web/src/domain/career-journey/journeyNav.ts 의 JOURNEY_GROUPS)
 */
export const WEB_MENU: {
  group: string;
  items: { slug: string; label: string }[];
}[] = [
  { group: '경험정리', items: [{ slug: 'experience', label: '경험정리' }] },
  {
    group: '서류 작성',
    items: [
      { slug: 'resume', label: '이력서' },
      { slug: 'personal-statement', label: '자기소개서' },
      { slug: 'portfolio', label: '포트폴리오' },
    ],
  },
  {
    group: '대기업',
    items: [
      { slug: 'large-corp', label: '대기업 자기소개서' },
      { slug: 'aptitude', label: '인적성' },
    ],
  },
  { group: '면접', items: [{ slug: 'interview', label: '면접' }] },
  {
    group: '직무특화',
    items: [
      { slug: 'hr', label: 'HR' },
      { slug: 'marketing', label: '마케팅' },
      { slug: 'pm', label: 'PM/PO' },
    ],
  },
];

// VITE_WEB_URL 이 없으면 상대 주소로 둔다 (AdminSidebar 와 같은 처리)
const WEB_URL = (import.meta.env.VITE_WEB_URL ?? '').replace(/\/$/, '');

/** 사용자 사이트에서 연다. path 는 / 로 시작한다 */
export const siteUrl = (path: string) => `${WEB_URL}${path}`;
