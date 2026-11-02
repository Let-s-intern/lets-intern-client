export const LETSCON_HERO_ID = 'letscon-hero';

export const LETSCON_SECTION_IDS = {
  intro: 'letscon-intro',
  lineup: 'letscon-lineup',
  apply: 'letscon-apply',
  offlineBenefit: 'letscon-offline-benefit',
  faq: 'letscon-faq',
} as const;

export const LETSCON_ANCHOR_TABS = [
  { id: LETSCON_SECTION_IDS.intro, label: '소개' },
  { id: LETSCON_SECTION_IDS.lineup, label: '라인업' },
  { id: LETSCON_SECTION_IDS.apply, label: '신청' },
  { id: LETSCON_SECTION_IDS.offlineBenefit, label: '오프라인 혜택' },
  { id: LETSCON_SECTION_IDS.faq, label: 'FAQ' },
];
