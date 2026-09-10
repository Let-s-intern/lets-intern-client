// 혜택 섹션의 가이드북 블록(시안 7-1)과 렛츠런 스터디 블록(시안 7-4) 데이터.
//
// GUIDEBOOK_ITEMS 와 STUDY_DETAIL_URL 은 ui/BenefitModal.tsx 에 있던 상수를 그대로 옮긴 것이다.
// 모달은 제휴 혜택 섹션(PartnerBenefitsSection)에서 아직 쓰이므로 여기서 import 해 간다.

/** 렛츠런 스터디 상세페이지(lets run 4주 스터디 3기) */
export const STUDY_DETAIL_URL =
  'https://www.letscareer.co.kr/program/challenge/288/lets-run-4주-스터디-3기';

export interface GuidebookItem {
  label: string;
  /**
   * 가이드북 ID. 링크와 썸네일 조회가 모두 이 값으로 연결된다.
   * 주소를 따로 적지 않는 이유는 `guidebookUrl` 주석에 있다.
   */
  id: number;
  /**
   * 썸네일 폴백. public/images/membership/ 하위 파일명.
   * 평소에는 어드민에 등록된 표지를 쓰고(`lib/useGuidebookThumbnails`), 조회 전이거나
   * 조회가 실패했을 때만 이 파일이 나온다.
   */
  src: string;
}

/**
 * 가이드북 상세 주소.
 *
 * 앱 내부 상대경로다. 절대 URL(`https://www.letscareer.co.kr/...`)로 적으면 dev·로컬에서
 * 눌렀을 때도 프로덕션으로 나가버려서, 작업 중인 화면을 확인할 수 없다.
 *
 * 제목 슬러그는 붙이지 않는다. 서버가 ID 만으로 정식 제목 경로로 리다이렉트해 주는데,
 * 슬러그를 적어 두면 운영에서 제목을 바꿀 때마다 낡는다.
 */
export function guidebookUrl(id: number): string {
  return `/program/guidebook/${id}`;
}

// 시안 11 — 가이드북 7종.
//
// 시안의 카드 제목 4개가 썸네일과 어긋나 있었다(썸네일은 "이력서 완성 가이드북" 인데
// 제목은 "포트폴리오 2주 완성 챌린지" 등). 제목을 그대로 쓰면 "포트폴리오 완성
// 가이드북" 이 세 번 나오는 반면, 썸네일 7장은 서로 겹치지 않고 "7종" 과도 맞는다.
// 그래서 **썸네일 기준**으로 제목을 맞췄다(LC-3294 결정).
//
// 대기업 자소서(15)·인적성(14)은 처음에 가이드북 ID 를 못 찾아, 링크를 주제가 비슷한
// 다른 가이드북(각각 5·9번)으로 채우고 표지도 같은 주제의 챌린지 것을 빌려 썼다.
// 5·9 는 이미 다른 카드가 쓰던 주소라 눌러도 404 가 아니라 "그럴싸한 다른 문서" 가
// 열렸고, 그래서 오래 눈에 띄지 않았다. 전용 가이드북이 있으므로 제 주소로 돌린다.
export const GUIDEBOOK_ITEMS: GuidebookItem[] = [
  { label: '기필코 경험정리 가이드북', id: 7, src: 'guide-experience.png' },
  { label: '이력서 완성 가이드북', id: 6, src: 'guide-resume.png' },
  { label: '자기소개서 완성 가이드북', id: 5, src: 'guide-coverletter.png' },
  {
    label: '대기업 자소서 완성 가이드북',
    id: 15,
    src: 'guide-major-coverletter.jpg',
  },
  { label: '포트폴리오 완성 가이드북', id: 2, src: 'guide-portfolio.png' },
  {
    label: '인적성 수리/추리 뽀개기 가이드북',
    id: 14,
    src: 'guide-aptitude.jpg',
  },
  { label: '면접 준비 끝장 가이드북', id: 9, src: 'guide-interview.png' },
];

/** 혜택 섹션의 단일 카드 (가이드북 · 스터디) */
export interface BenefitHighlightCard {
  title: string;
  desc: string;
  badges: string[];
  /** public/images/membership/ 하위 파일명 */
  src: string;
  url: string;
  imgAlt: string;
}

// 시안 7-1. 카드 하나로 가이드북 전종을 소개한다(표지 6권 일러스트).
//
// 링크는 개별 가이드북 상세가 아니라 가이드북 목록으로 보낸다 — 카드가 "6종"을 소개하므로
// 한 권만 열어주면 나머지를 못 찾는다. 앱 내부 상대경로라 dev·로컬에서도 그대로 동작한다.
export const GUIDEBOOK_LIST_URL = '/program?type=GUIDEBOOK';

export const GUIDEBOOK_CARD: BenefitHighlightCard = {
  title: '가이드북',
  desc: '경험정리부터 자기소개서, 면접까지 취업에 필요한 준비를 내 속도에 맞춰 진행할 수 있어요.',
  badges: ['11/30까지 열람 가능'],
  src: 'guidebook-set.webp',
  url: GUIDEBOOK_LIST_URL,
  imgAlt: '취업 준비 핵심 단계 가이드북 6종 표지',
};

// 시안 7-4
export const STUDY_CARD: BenefitHighlightCard = {
  title: '렛츠런 스터디',
  desc: '운영진의 초집중 케어와 함께 매주 목표를 세우고 인증하는 온라인 스터디에 3개월간 무료로 참여해보세요. 같은 목표를 가진 사람들과 꾸준한 준비 루틴을 만들어요.',
  badges: ['무료 참여', '페이백 불가'],
  src: 'study-banner.png',
  url: STUDY_DETAIL_URL,
  imgAlt: '렛츠런 스터디 배너',
};
