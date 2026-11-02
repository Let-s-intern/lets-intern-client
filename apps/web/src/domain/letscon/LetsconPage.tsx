'use client';

import { LETSCON_HERO_ID, LETSCON_SECTION_IDS } from './data/sections';
import { useLetsconApply } from './hooks/useLetsconApply';
import { useReveal } from './hooks/useReveal';
import styles from './letscon.module.css';
import { AnchorTabs } from './ui/AnchorTabs';
import { Apply } from './ui/Apply';
import { ApplySheet } from './ui/ApplySheet';
import { BottomApply } from './ui/BottomApply';
import { Empathy } from './ui/Empathy';
import { Faq } from './ui/Faq';
import { FloatingApplyBar } from './ui/FloatingApplyBar';
import { Hero } from './ui/Hero';
import { Intro } from './ui/Intro';
import { Lineup } from './ui/Lineup';
import { NextStep } from './ui/NextStep';
import { OfflineBenefit } from './ui/OfflineBenefit';
import { ParticipationGuide } from './ui/ParticipationGuide';

// 본문의 # 링크는 위로 이동하므로 헤더와 앵커 탭 높이만큼 띄운다. 앵커 탭 클릭은 AnchorTabs 가 방향별로 계산한다
const ANCHOR_TARGET =
  'scroll-mt-[calc(var(--letscon-header-height,84px)+60px)] md:scroll-mt-[calc(var(--letscon-header-height,156px)+72px)]';

export default function LetsconPage() {
  const apply = useLetsconApply();

  const rootRef = useReveal();

  return (
    <div ref={rootRef} className={styles.root}>
      <div id={LETSCON_HERO_ID}>
        <Hero apply={apply} />
      </div>
      <AnchorTabs showFaq />
      <Empathy />
      <div id={LETSCON_SECTION_IDS.intro} className={ANCHOR_TARGET}>
        <Intro />
      </div>
      <div id={LETSCON_SECTION_IDS.lineup} className={ANCHOR_TARGET}>
        <Lineup />
      </div>
      <div id={LETSCON_SECTION_IDS.apply} className={ANCHOR_TARGET}>
        <Apply apply={apply} />
      </div>
      <div id={LETSCON_SECTION_IDS.offlineBenefit} className={ANCHOR_TARGET}>
        <OfflineBenefit offlineApplied={apply.offline === 'applied'} />
      </div>
      <ParticipationGuide />
      <NextStep />
      <div id={LETSCON_SECTION_IDS.faq} className={ANCHOR_TARGET}>
        <Faq />
      </div>
      <BottomApply apply={apply} />
      <FloatingApplyBar apply={apply} />
      {apply.isSheetOpen ? <ApplySheet apply={apply} /> : null}
    </div>
  );
}
