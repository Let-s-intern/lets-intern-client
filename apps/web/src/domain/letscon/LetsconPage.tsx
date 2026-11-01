'use client';

import { liveFaqQueryOptions } from '@/api/program';
import { useQuery } from '@tanstack/react-query';
import { LETSCON_LIVE_IDS } from './data/live';
import { LETSCON_HERO_ID, LETSCON_SECTION_IDS } from './data/sections';
import { useLetsconApply } from './hooks/useLetsconApply';
import { useReveal } from './hooks/useReveal';
import styles from './letscon.module.css';
import { sortFaqsById } from './lib/faq';
import { AnchorTabs } from './ui/AnchorTabs';
import { Apply } from './ui/Apply';
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

  // FAQ 는 온라인 라이브에 연결된 것을 쓴다. 라이브 ID 가 없으면 요청하지 않는다
  const onlineLiveId = LETSCON_LIVE_IDS.online;
  const { data: faqData } = useQuery({
    ...liveFaqQueryOptions(onlineLiveId ?? 0),
    enabled: onlineLiveId !== null,
  });
  const faqs = sortFaqsById(faqData?.faqList);
  const showFaq = faqs.length > 0;
  const rootRef = useReveal(showFaq);

  return (
    <div ref={rootRef} className={styles.root}>
      <div id={LETSCON_HERO_ID}>
        <Hero apply={apply} />
      </div>
      <AnchorTabs showFaq={showFaq} />
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
      {showFaq && (
        <div id={LETSCON_SECTION_IDS.faq} className={ANCHOR_TARGET}>
          <Faq faqs={faqs} />
        </div>
      )}
      <BottomApply apply={apply} />
      <FloatingApplyBar apply={apply} />
    </div>
  );
}
