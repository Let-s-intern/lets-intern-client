import { REVIEW_TABS } from '@/app/admin/review/AdminReviewHeader';
import { CHALLENGE_OPERATION_TABS } from '@/pages/challenge/ui/challengeOperationTabs';

/** 사이드바 검색 한 건. 「parents › label」 로 보이고 path 로 이동한다 */
export interface SearchEntry {
  label: string;
  path: string;
  parents: string[];
  /** 화면에 보이지 않는 별칭. 검색에만 쓴다 */
  keywords: string[];
}

/** 사이드바 메뉴 배열(`AdminSidebar` 의 navData)과 같은 모양. 외부 링크는 검색에서 뺀다 */
export interface SearchNavSection {
  title: string;
  itemList: readonly { name: string; url: string; external?: boolean }[];
}

/** 사이드바 메뉴에 붙이는 별칭. 메뉴 자체는 navData 에서 자동으로 들어온다 */
const MENU_KEYWORDS: Record<string, string[]> = {
  '/mentors': ['멘토'],
  '/mentors/register': ['멘토 추가'],
  '/mentors/keywords': ['키워드', '해시태그', '태그'],
  '/mentors/pick': ['픽', '렛커픽', '추천 멘토'],
  '/mentors/company-logos': ['파비콘', '로고 후보', '로고', '회사로고'],
};

/** 「프로그램 개설」(/programs) 상단 등록 버튼 */
const PROGRAM_CREATE_ENTRIES: SearchEntry[] = [
  {
    label: '챌린지 등록',
    path: '/challenge/create',
    parents: ['프로그램 관리', '프로그램 개설'],
    keywords: ['챌린지 만들기', '챌린지 개설', '챌린지 생성'],
  },
  {
    label: 'LIVE 클래스 등록',
    path: '/live/create',
    parents: ['프로그램 관리', '프로그램 개설'],
    keywords: ['라이브 등록', '라이브클래스', '라이브 만들기', 'LIVE 만들기'],
  },
  {
    label: 'VOD 클래스 등록',
    path: '/vod/create',
    parents: ['프로그램 관리', '프로그램 개설'],
    keywords: ['VOD 등록', 'VOD 만들기', '브이오디'],
  },
  {
    label: '가이드북 등록',
    path: '/guidebook/create',
    parents: ['프로그램 관리', '프로그램 개설'],
    keywords: ['가이드북 만들기', '가이드북 개설'],
  },
];

/** 챌린지 운영 화면 상단 탭의 별칭. 라벨은 화면 탭 그대로 쓴다 */
const CHALLENGE_OPERATION_KEYWORDS: Record<string, string[]> = {
  home: ['대시보드'],
  'register-mission': ['미션 등록'],
  attendances: ['제출 관리', '제출', '출석'],
  payback: ['환급'],
};

/**
 * 챌린지 운영 화면 안 탭. 어느 챌린지인지 아직 모르므로 /challenge/operation 으로 보낸다.
 * 그 화면은 탭을 고르는 쿼리를 받지 않고 첫 챌린지의 홈으로 넘긴다. 탭은 거기서 고른다
 */
const CHALLENGE_OPERATION_ENTRIES: SearchEntry[] = CHALLENGE_OPERATION_TABS.map(
  (tab) => ({
    label: tab.text,
    path: '/challenge/operation',
    parents: ['챌린지 관리', '챌린지 운영'],
    keywords: CHALLENGE_OPERATION_KEYWORDS[tab.id] ?? [],
  }),
);

/** 사이드바에 없는 화면 안 탭. 같은 화면의 탭을 주소(?tab=)로 바로 연다 */
const TAB_ENTRIES: SearchEntry[] = [
  {
    label: '상품 관리',
    path: '/live-mentoring?tab=products',
    parents: ['프로그램 관리', '1:1 LIVE 멘토링'],
    keywords: ['개설', '강제 종료'],
  },
  {
    label: '참여자',
    path: '/live-mentoring?tab=participants',
    parents: ['프로그램 관리', '1:1 LIVE 멘토링'],
    keywords: ['환불', '예약'],
  },
  {
    label: '후기',
    path: '/live-mentoring?tab=reviews',
    parents: ['프로그램 관리', '1:1 LIVE 멘토링'],
    keywords: ['후기 노출', '후기 순서'],
  },
  {
    label: '상세페이지',
    path: '/live-mentoring?tab=detailPage',
    parents: ['프로그램 관리', '1:1 LIVE 멘토링'],
    keywords: ['상세 페이지 수정', '자유 입력란'],
  },
  {
    label: '로고 목록',
    path: '/mentors/company-logos?tab=list',
    parents: ['멘토 관리', '회사 로고'],
    keywords: ['로고 라이브러리'],
  },
  {
    label: '일괄 등록',
    path: '/mentors/company-logos?tab=bulk',
    parents: ['멘토 관리', '회사 로고'],
    keywords: ['벌크', '일괄', '로고 일괄'],
  },
  ...REVIEW_TABS.map((tab) => ({
    label: tab.label,
    path: tab.href,
    parents: ['프로그램 관리', '후기 관리'],
    keywords: ['후기'],
  })),
];

/** 사이드바 메뉴만. navData 를 그대로 읽는다(복사본을 두지 않는다). 검색어가 비었을 때 전체 메뉴로도 보인다 */
export const buildMenuEntries = (
  navData: readonly SearchNavSection[],
): SearchEntry[] =>
  navData.flatMap((section) =>
    section.itemList
      .filter((item) => !item.external)
      .map((item) => ({
        label: item.name,
        path: item.url,
        parents: [section.title],
        keywords: MENU_KEYWORDS[item.url] ?? [],
      })),
  );

/** 검색 대상 전체. 사이드바 메뉴에 화면 안 버튼·탭을 더한다 */
export const buildSearchEntries = (
  navData: readonly SearchNavSection[],
): SearchEntry[] => [
  ...buildMenuEntries(navData),
  ...PROGRAM_CREATE_ENTRIES,
  ...CHALLENGE_OPERATION_ENTRIES,
  ...TAB_ENTRIES,
];
