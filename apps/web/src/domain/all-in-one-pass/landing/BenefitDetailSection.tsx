'use client';

import LexicalContent from '@/common/lexical/LexicalContent';
import clsx from 'clsx';
import { useState } from 'react';
import type { AllInOnePassPlan } from '../types';
import { BenefitCard, TabPlaceholder, VodCard } from './benefitCards';
import type { BenefitTabKey } from './benefitDetail';
import { parseLexicalRoot, type LandingVod } from './landingContent';
import LandingSectionHeader from './LandingSectionHeader';
import { useBenefitTabs } from './useBenefitTabs';

interface Props {
  passTitle: string;
  plans: AllInOnePassPlan[];
  /** 어드민이 고른 노출 VOD(landingDescription). url 없음 — 비클릭 카드. */
  vods: LandingVod[];
  /** 어드민이 집계한 전체 VOD 수 (VOD 탭 "N종" 표기용) */
  vodCount: number;
  /** 혜택 상세 상단 렉시컬(플레이북) */
  playbookLexical: string;
  /** 혜택 상세 하단 렉시컬(특별혜택) */
  benefitLexical: string;
}

/** 모바일에서 접었을 때 보여줄 카드 수 (초과분은 더보기) */
const MOBILE_COLLAPSED_COUNT = 3;

/** 혜택 상세 섹션(#benefit-detail) — 콘텐츠 탭 + 상·하단 렉시컬. */
export default function BenefitDetailSection({
  passTitle,
  plans,
  vods,
  vodCount,
  playbookLexical,
  benefitLexical,
}: Props) {
  const playbookRoot = parseLexicalRoot(playbookLexical);
  const benefitRoot = parseLexicalRoot(benefitLexical);
  const { visibleTabs, tabData, countFor } = useBenefitTabs(plans, vodCount);

  const [active, setActive] = useState<BenefitTabKey>(
    () => visibleTabs[0]?.key ?? 'challenge',
  );
  const [expanded, setExpanded] = useState(false);

  const activeTab = visibleTabs.find((t) => t.key === active) ?? visibleTabs[0];
  const { cards, loading } = tabData[active];

  // titlePrefix 에 {n} 이 있으면 그 자리에 개수+단위를 끼워넣고, 없으면 뒤에 붙임.
  const countUnit = `${countFor(active)}${activeTab.unit}`;
  const title = activeTab.titlePrefix.includes('{n}')
    ? activeTab.titlePrefix.replace('{n}', countUnit)
    : `${activeTab.titlePrefix} ${countUnit}`;

  const selectTab = (key: BenefitTabKey) => {
    setActive(key);
    setExpanded(false);
  };

  return (
    <section id="benefit-detail" className="scroll-mt-20 bg-white">
      <div className="mx-auto w-full max-w-[1040px] px-5 py-12 md:px-0 md:py-[100px]">
        {playbookRoot && (
          <div className="break-words pb-12 md:pb-[100px]">
            <LexicalContent node={playbookRoot} />
          </div>
        )}

        <LandingSectionHeader
          header={`${passTitle}에 포함된 콘텐츠, 혜택`}
          mainHeader="취업 준비에 필요한 다양한 혜택"
          subHeader={
            '챌린지부터 가이드북, VOD, 멘토링까지.\n패스에 포함된 혜택을 한눈에 확인해 보세요.'
          }
        />

        {/* 탭 — 모바일 2열 그리드, 데스크탑 가로 나열 */}
        <div className="mt-10 grid grid-cols-2 gap-2 md:mt-14 md:flex md:flex-wrap md:gap-3">
          {visibleTabs.map((tab) => {
            const isActive = tab.key === active;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => selectTab(tab.key)}
                className={clsx(
                  'text-xsmall14 md:text-small18 rounded-xs border px-3 py-3 text-left transition md:px-5 md:text-center',
                  isActive
                    ? 'border-neutral-0 bg-neutral-0 text-white'
                    : 'text-neutral-35 border-neutral-70 hover:border-neutral-60 bg-white',
                )}
              >
                {tab.label}
                {!tab.hideBadgeCount && (
                  <span className="text-neutral-70 font-semibold">
                    {' '}
                    {countFor(tab.key)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 활성 탭 콘텐츠 */}
        <div className="md:mt-15 mt-8">
          <h3 className="text-small20 md:text-xlarge28 text-neutral-0 block font-bold">
            {title}
          </h3>
          <p className="text-xsmall14 md:text-small20 text-neutral-40 mt-4 whitespace-pre-line font-light">
            {activeTab.description}
          </p>

          {activeTab.image ? (
            <div className="mx-auto mt-8 flex max-w-[893px] flex-col md:mt-10">
              <picture>
                {activeTab.imageMobile && (
                  <source
                    media="(max-width: 767px)"
                    srcSet={activeTab.imageMobile}
                  />
                )}
                <img alt={title} className="w-full" src={activeTab.image} />
              </picture>
              {activeTab.ctaHref && activeTab.ctaLabel && (
                <a
                  href={activeTab.ctaHref}
                  className="text-primary-dark text-xsmall14 md:text-small18 mt-8 self-end md:mt-2.5"
                >
                  {activeTab.ctaLabel} →
                </a>
              )}
            </div>
          ) : active === 'vod' ? (
            vods.length === 0 ? (
              <TabPlaceholder />
            ) : (
              <>
                <div className="mt-8 grid grid-cols-1 gap-5 md:mt-6 md:grid-cols-3">
                  {vods.map((vod, i) => (
                    <VodCard key={`${vod.title}-${i}`} vod={vod} />
                  ))}
                </div>
                <p className="text-xsmall14 md:text-small18 text-neutral-40 mt-8 font-light">
                  *패스에 포함된 VOD의 구성 중 일부에요. 패스 기간동안 자유롭게
                  시청할 수 있어요.
                </p>
              </>
            )
          ) : loading ? (
            <TabPlaceholder>불러오는 중...</TabPlaceholder>
          ) : cards.length === 0 ? (
            <TabPlaceholder />
          ) : (
            <>
              <div className="mt-8 grid grid-cols-1 gap-5 md:mt-6 md:grid-cols-4">
                {cards.map((card, i) => (
                  <BenefitCard
                    key={card.key}
                    card={card}
                    className={clsx(
                      i >= MOBILE_COLLAPSED_COUNT &&
                        !expanded &&
                        'hidden md:flex',
                    )}
                  />
                ))}
              </div>

              {cards.length > MOBILE_COLLAPSED_COUNT && !expanded && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="text-xsmall14 mt-4 w-full rounded-sm border border-[#4A76FF] py-3 font-medium text-[#4A76FF] md:hidden"
                >
                  더보기
                </button>
              )}
            </>
          )}
        </div>

        {benefitRoot && (
          <div className="break-words pt-12 md:pt-[100px]">
            <LexicalContent node={benefitRoot} />
          </div>
        )}
      </div>
    </section>
  );
}
