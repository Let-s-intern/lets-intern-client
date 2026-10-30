'use client';

import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import CountUpNumber from './CountUpNumber';
import LandingSectionHeader from './LandingSectionHeader';
import {
  buildVodOptionCard,
  toBenefitCards,
  type BenefitCard,
  type LandingBenefit,
} from './landingContent';
import { useBenefitCounts } from './useBenefitCounts';

interface Props {
  passTitle: string;
  periodDays: number | null;
  /** 어드민이 통째로 저장한 혜택요약 카드(최대 6, VOD 제외). */
  benefitsSummary: LandingBenefit[];
  /** 어드민이 집계한 전체 VOD 수 (VOD 옵션 카드 "VOD N종" 표기용) */
  vodCount: number;
  /** VOD 옵션 추가결제 판매 여부. 켜져 있으면 VOD 카드를 2번째에 삽입 */
  vodOptionOnSale: boolean;
  onBenefitClick: () => void;
}

const SUMMARY_DESCRIPTION =
  '경험 정리부터 자소서·포폴, 인적성·면접까지.\n필요한 자료와 현직자의 도움을 한 번에 이용해 보세요.';

// 신뢰 지표(하드코딩). value = 큰 숫자, unit = 뒤에 붙는 작은 단위.
const METRICS = [
  { label: '교육 만족도', value: '4.6', unit: '' },
  { label: '누적 참여자 수', value: '5,000+', unit: '명' },
  { label: '수료율', value: '80+', unit: '%' },
  { label: '누적 후기 개수', value: '3,300+', unit: '개' },
  { label: '인스타그램 팔로워 수', value: '1.8', unit: 'M' },
  { label: '커뮤니티 참여자 수', value: '2,500+', unit: '명' },
];

/** 혜택 섹션(#benefit) — 어드민이 저장한 혜택요약 카드 + VOD 옵션 판매 시 VOD 카드 삽입. */
export default function BenefitSummarySection({
  passTitle,
  periodDays,
  benefitsSummary,
  vodCount,
  vodOptionOnSale,
  onBenefitClick,
}: Props) {
  const counts = useBenefitCounts(vodCount);
  // 저장된 benefitsSummary 그대로 + VOD 옵션 판매 중이면 2번째(위치 A)에 VOD 카드 삽입.
  const base = toBenefitCards(benefitsSummary);
  const cards = vodOptionOnSale
    ? [...base.slice(0, 1), buildVodOptionCard(counts), ...base.slice(1)].slice(
        0,
        6,
      )
    : base;

  const leftSlots = [0, 2, 4];
  const rightSlots = [1, 3, 5];

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

  // 한 컬럼(3슬롯) 렌더. 카드가 없는 슬롯은 같은 높이의 빈 자리로 예약.
  const Column = ({
    slots,
    dir,
  }: {
    slots: number[];
    dir: 'left' | 'right';
  }) => (
    <div
      className={clsx('flex flex-col gap-12', dir === 'right' && 'items-end')}
    >
      {slots.map((cardIndex, pos) => {
        const card = cards[cardIndex];
        return card ? (
          <Card
            key={card.name}
            card={card}
            className="landing-poke md:h-[92px]"
            style={pokeStyle(pos, dir)}
          />
        ) : (
          <div key={`empty-${cardIndex}`} aria-hidden className="h-[92px]" />
        );
      })}
    </div>
  );

  return (
    <section id="benefit" className="scroll-mt-20 bg-[#F7F8FC]">
      <div className="mx-auto flex w-full max-w-[1040px] flex-col px-5 md:px-0">
        <div className="w-full py-12 md:py-[100px]">
          <LandingSectionHeader
            header="혜택 요약"
            mainHeader={`${passTitle}로 모두 담았습니다.`}
            subHeader={SUMMARY_DESCRIPTION}
          />

          <div className="relative mt-14 hidden md:block">
            <div className="flex justify-between px-1">
              <Column slots={leftSlots} dir="left" />
              <Column slots={rightSlots} dir="right" />
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
        <div className="flex w-full flex-col items-center gap-8 py-12 md:gap-12 md:py-[100px]">
          <p className="text-xxlarge36 text-center font-bold md:text-[40px]">
            <span className="text-[#4A76FF]">5,000명</span> 이상의 취준생이
            렛츠커리어와 <span className="text-[#4A76FF]">함께</span>했어요.
          </p>

          <div className="bg-static-100 rounded-ms grid w-full grid-cols-2 gap-px overflow-hidden md:grid-cols-6 md:gap-6">
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="flex flex-col items-center gap-3 bg-white px-2 py-6 md:py-7"
              >
                <span className="text-xsmall14 md:text-xsmall16 text-neutral-20 font-medium">
                  {m.label}
                </span>
                <span className="text-xlarge28 md:text-xxlarge32 font-bold">
                  <CountUpNumber value={m.value} />
                  {m.unit && (
                    <span className="text-xsmall16 md:text-medium24 ml-0.5 font-semibold">
                      {m.unit}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
