import { LETSCON_ANCHOR_TABS, LETSCON_SECTION_IDS } from '../data/sections';

export const getAnchorTabs = (showFaq: boolean) =>
  showFaq
    ? LETSCON_ANCHOR_TABS
    : LETSCON_ANCHOR_TABS.filter((tab) => tab.id !== LETSCON_SECTION_IDS.faq);
