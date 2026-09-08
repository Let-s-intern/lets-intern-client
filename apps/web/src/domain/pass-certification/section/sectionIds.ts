/** 합격 인증 랜딩 섹션 id (navbar 스크롤 타겟) */
export const PASS_SECTION_ID = {
  reward: 'pass-reward',
  passCase: 'pass-case',
  process: 'pass-process',
  form: 'pass-form',
  faq: 'pass-faq',
} as const;

export interface PassNavItem {
  title: string;
  to: string;
}

/** navbar 항목 (순서 = 페이지 섹션 순서) */
export const PASS_NAV_ITEMS: PassNavItem[] = [
  { title: '리워드', to: PASS_SECTION_ID.reward },
  { title: '합격자', to: PASS_SECTION_ID.passCase },
  { title: '인증절차', to: PASS_SECTION_ID.process },
  { title: '인증폼', to: PASS_SECTION_ID.form },
  { title: 'FAQ', to: PASS_SECTION_ID.faq },
];
