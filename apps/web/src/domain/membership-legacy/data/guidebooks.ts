// 혜택 섹션의 가이드북 블록(시안 7-1)과 렛츠런 스터디 블록(시안 7-4) 데이터.
//
// GUIDEBOOK_ITEMS 와 STUDY_DETAIL_URL 은 ui/BenefitModal.tsx 에 있던 상수를 그대로 옮긴 것이다.
// 모달은 제휴 혜택 섹션(PartnerBenefitsSection)에서 아직 쓰이므로 여기서 import 해 간다.

/** 렛츠런 스터디 상세페이지(lets run 4주 스터디 3기) */
export const STUDY_DETAIL_URL =
  'https://www.letscareer.co.kr/program/challenge/288/lets-run-4주-스터디-3기';

export interface GuidebookItem {
  label: string;
  /** public/images/membership/ 하위 파일명 */
  src: string;
  url: string;
}

// 가이드북 표지(제목이 이미지 안에 포함) — 인적성은 표지 이미지 미수급
// url: /program/guidebook/{id} → 정식 제목 경로로 리다이렉트됨
export const GUIDEBOOK_ITEMS: GuidebookItem[] = [
  {
    label: '경험정리 가이드북',
    src: 'guide-experience.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/7',
  },
  {
    label: '이력서 완성 가이드북',
    src: 'guide-resume.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/6',
  },
  {
    label: '자기소개서 완성 가이드북',
    src: 'guide-coverletter.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/5',
  },
  {
    label: '포트폴리오 완성 가이드북',
    src: 'guide-portfolio.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/2',
  },
  {
    label: '면접 준비 끝장 가이드북',
    src: 'guide-interview.png',
    url: 'https://www.letscareer.co.kr/program/guidebook/9',
  },
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
// 한 권만 열어주면 나머지를 못 찾는다. 앱 내부 상대경로라 dev·로컬에서도 그대로 동작한다
// (GUIDEBOOK_ITEMS 의 절대 URL 은 프로덕션 도메인으로 나가버린다).
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
