'use client';

import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { AllInOnePassPlan } from '../types';
import LandingSectionHeader from './LandingSectionHeader';
import {
  getBenefitCards,
  type BenefitCard,
  type LandingBenefit,
} from './landingContent';

interface Props {
  passTitle: string;
  periodDays: number | null;
  plans: AllInOnePassPlan[];
  additionalBenefits: LandingBenefit[];
  onBenefitClick: () => void;
}

const SUMMARY_DESCRIPTION =
  '경험 정리부터 자소서·포폴, 인적성·면접까지.\n필요한 자료와 현직자의 도움을 한 번에 이용해 보세요.';

/** 혜택 섹션(#benefit) — 혜택 요약 카드(플랜 union 코어 + 추가혜택). */
export default function BenefitSummarySection({
  passTitle,
  periodDays,
  plans,
  additionalBenefits,
  onBenefitClick,
}: Props) {
  const cards = getBenefitCards(plans, additionalBenefits);

  const leftCards = cards.filter((_, i) => i % 2 === 0);
  const rightCards = cards.filter((_, i) => i % 2 === 1);

  const Card = ({
    card,
    className,
    style,
  }: {
    card: BenefitCard;
    className?: string;
    style?: CSSProperties;
  }) => (
    <button
      type="button"
      onClick={onBenefitClick}
      style={style}
      className={clsx(
        'flex w-full items-center gap-4 rounded-lg border border-[#E7E9F2] bg-white px-5 py-[19px] text-left transition hover:border-[#CFD4EB] md:w-[320px]',
        className,
      )}
    >
      <span className="rounded-ms flex h-11 w-11 shrink-0 items-center justify-center bg-[#edeffe]">
        <img src={card.iconSrc} alt="" className="h-6 w-6" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex justify-between">
          <p className="text-small18 text-neutral-0 font-bold">{card.name}</p>
          <ChevronRight size={24} className="text-neutral-30 shrink-0" />
        </div>
        <p className="text-xsmall14 truncate text-[#808799]">
          {card.description}
        </p>
      </div>
    </button>
  );

  // 평소 위치(inset) + 중앙으로 찌르는 방향. 가운데 행(pos 1)은 바깥 끝(inset 0).
  const pokeStyle = (pos: number, dir: 'left' | 'right'): CSSProperties =>
    ({
      '--rest-x': pos === 1 ? '0px' : dir === 'left' ? '3.5rem' : '-3.5rem',
      '--poke-x': dir === 'left' ? '7px' : '-7px',
    }) as CSSProperties;

  return (
    <section id="benefit" className="scroll-mt-20 bg-[#F7F8FC]">
      <div className="mx-auto w-full max-w-[1040px] px-5 md:px-0">
        <div className="w-full py-12 md:py-[100px]">
          <LandingSectionHeader
            header="혜택 요약"
            mainHeader={`${passTitle}로 모두 담았습니다.`}
            subHeader={SUMMARY_DESCRIPTION}
          />

          <div className="relative mt-14 hidden md:block">
            <div className="flex justify-between px-1">
              <div className="flex flex-col gap-12">
                {leftCards.map((card, i) => (
                  <Card
                    key={card.name}
                    card={card}
                    className="landing-poke"
                    style={pokeStyle(i, 'left')}
                  />
                ))}
              </div>
              <div className="flex flex-col items-end gap-12">
                {rightCards.map((card, i) => (
                  <Card
                    key={card.name}
                    card={card}
                    className="landing-poke"
                    style={pokeStyle(i, 'right')}
                  />
                ))}
              </div>
            </div>

            {periodDays != null && (
              <div className="absolute left-1/2 top-1/2 flex w-[308px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 overflow-hidden rounded-[40px] bg-[#4A76FF] p-[30px] text-center text-white">
                <span
                  aria-hidden
                  className="reward-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
                <p className="text-small20 md:text-large26 font-bold">
                  포함 혜택 한눈에 보기
                </p>
                <p className="text-xsmall16 md:text-small20">
                  총 {periodDays}일 이용 가능
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4 md:hidden">
            {cards.map((card) => (
              <Card key={card.name} card={card} />
            ))}
          </div>

          <p className="text-xsmall14 md:text-small18 text-neutral-45 mt-8 text-center md:mt-[60px]">
            궁금한 혜택을 눌러 자세히 살펴보세요.
          </p>
        </div>
      </div>
    </section>
  );
}
