'use client';

import { Check } from 'lucide-react';

import { capturePaymentCtaClicked } from '../analytics';
import { formatKRW } from '../data/membership';
import {
  getIndividualTotal,
  getSaveAmount,
  INDIVIDUAL_ITEMS,
  PASS_INCLUDE_LINES,
  PRICING,
} from '../data/pricing';
import { ctaLabel, IS_CTA_DISABLED } from '../lib/membershipChallenge';
import { openPlanSheet } from '../lib/planSheet';
import { useMembershipChallengeData } from '../lib/useMembershipChallengeData';

/**
 * 개편 시안 11 — 가격 비교 (PRD 4.11).
 *
 * `CompareSection`(조합 3줄 비교표) + `PlansSection`(플랜 카드) 두 섹션이 하던 일을
 * 이 한 섹션이 한다. 두 카드를 맞세우는 형태라 표와 카드로 나눌 이유가 없어졌다.
 *
 * 패스 가격만 어드민 값(`useMembershipChallengeData().salePrice`)이고 나머지는 정적이다.
 * 합계와 SAVE 는 `data/pricing.ts` 가 계산한다 — 여기에 숫자를 적지 않는다.
 */
export default function PricingSection() {
  const { salePrice } = useMembershipChallengeData();
  const total = getIndividualTotal();
  const save = getSaveAmount(salePrice);

  return (
    <section className="bg-[#F7F8FC] py-16 md:py-24" id={PRICING.anchorId}>
      <div className="wrap rv">
        <p className="text-center text-sm font-bold tracking-wide text-[#F36D32]">
          {PRICING.eyebrow}
        </p>

        <h2 className="mt-4 text-center text-2xl font-bold leading-snug text-[#11142B] md:text-[2.5rem]">
          {PRICING.titleLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        {/*
          모바일은 카드 → VS → 카드 세로 순서, 데스크톱은 가로다. VS 를 절대 배치하지 않고
          가운데 항목으로 두면 두 방향 모두 같은 마크업으로 끝난다.
        */}
        <div className="mt-10 flex flex-col items-center gap-4 md:mt-14 md:flex-row md:items-stretch md:gap-6">
          <div className="w-full rounded-xxl bg-white p-6 md:flex-1 md:p-10">
            <p className="text-xsmall14 font-bold text-neutral-45">
              {PRICING.optionLabel}
            </p>
            <h3 className="mt-3 text-lg font-bold text-neutral-0 md:text-xl">
              {PRICING.optionTitle}
            </h3>

            <ul className="mt-6 border-t border-neutral-85">
              {INDIVIDUAL_ITEMS.map((item) => (
                <li
                  className="flex items-center justify-between gap-4 border-b border-neutral-85 py-4 text-xsmall14 md:text-xsmall16"
                  key={item.label}
                >
                  <span className="text-neutral-30">{item.label}</span>
                  <strong className="shrink-0 font-bold text-neutral-0">
                    {formatKRW(item.price)}원
                  </strong>
                </li>
              ))}
            </ul>

            <p className="mt-5 flex items-center justify-between gap-4 text-xsmall14 md:text-xsmall16">
              <span className="font-bold text-neutral-0">
                {PRICING.totalLabel}
              </span>
              {/*
                취소선은 "이 금액을 내지 않아도 된다" 는 뜻이라 굵기와 색을 함께 죽인다.
                옆 카드의 파란 판매가가 결론이다.
              */}
              <strong className="shrink-0 text-xl font-bold text-neutral-45 line-through md:text-2xl">
                {formatKRW(total)}원
              </strong>
            </p>
          </div>

          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#11142B] text-xsmall14 font-bold text-white"
          >
            {PRICING.vsLabel}
          </span>

          <div className="w-full rounded-xxl border-2 border-primary bg-white p-6 md:flex-1 md:p-10">
            <p className="text-xsmall14 font-bold text-primary">
              {PRICING.passOptionLabel}
            </p>
            <h3 className="mt-3 text-lg font-bold text-neutral-0 md:text-xl">
              {PRICING.passTitle}
            </h3>

            <p className="mt-6 border-t border-neutral-85 pt-8 text-3xl font-bold text-primary md:text-[2.5rem]">
              {formatKRW(salePrice)}원
            </p>

            {/*
              합계보다 패스가 비싸지면 절약액이 0 이 된다. 그때는 칩 자체를 그리지 않는다 —
              "0원 SAVE" 가 남는 쪽이 더 나쁘다.
            */}
            {save > 0 ? (
              <p className="mt-4">
                <span className="inline-flex rounded-full bg-[#E8F7F0] px-4 py-2.5 text-xsmall14 font-bold text-[#16A46B]">
                  {PRICING.saveLead} {formatKRW(save)}원 {PRICING.saveTail}
                </span>
              </p>
            ) : null}

            <ul className="mt-6 flex flex-col gap-3">
              {PASS_INCLUDE_LINES.map((line) => (
                <li
                  className="flex items-start gap-2.5 text-xsmall14 md:text-xsmall16"
                  key={line.text}
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-10 text-primary"
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="text-neutral-30">
                    {line.strong ? (
                      <strong className="mr-1.5 font-bold text-neutral-0">
                        {line.strong}
                      </strong>
                    ) : null}
                    {line.text}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className="mt-8 w-full rounded-full bg-primary py-4 text-base font-bold text-white disabled:opacity-50"
              disabled={IS_CTA_DISABLED}
              onClick={() => {
                capturePaymentCtaClicked({ location: 'pricing' });
                openPlanSheet();
              }}
              type="button"
            >
              {ctaLabel(PRICING.ctaLabel)}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
