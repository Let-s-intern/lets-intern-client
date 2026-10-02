'use client';

import { capturePaymentCtaClicked } from '../analytics';
import { formatKRW } from '../data/membership';
import { FINAL_CTA } from '../data/finalCta';
import { ctaLabel, IS_CTA_DISABLED } from '../lib/membershipChallenge';
import { openPlanSheet } from '../lib/planSheet';
import { useMembershipChallengeData } from '../lib/useMembershipChallengeData';

/**
 * 개편 시안 12 — 마지막 CTA (PRD 4.12).
 *
 * 오래 렌더되지 않던 파일이다. 옛 내용(선착순 배지 + 카운트다운)은 시안에 없어 버리고
 * 시안 12 로 다시 만들었다. 결제는 기존 경로 그대로 `openPlanSheet()` 다.
 */
export default function FinalCtaSection() {
  const { salePrice } = useMembershipChallengeData();

  return (
    <section className="bg-[#11142B] py-16 md:py-24" id={FINAL_CTA.anchorId}>
      <div className="wrap rv">
        {/*
          흐름 칩 6개. 화살표는 칩 사이의 이음새라 목록 항목이 아니다 — aria-hidden 으로
          빼고, 순서 자체는 ol 이 전한다.
        */}
        <ol className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {FINAL_CTA.chips.map((chip, i) => (
            <li className="flex items-center gap-2 md:gap-3" key={chip.label}>
              <span
                className={
                  chip.goal
                    ? 'bg-primary text-xsmall14 inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 font-bold text-white'
                    : 'text-xsmall14 inline-flex items-center rounded-full border border-[#3B3E52] bg-[#24273C] px-4 py-2.5 font-medium text-[#D9DCEA]'
                }
              >
                {chip.icon ? <span aria-hidden="true">{chip.icon}</span> : null}
                {chip.label}
              </span>
              {i < FINAL_CTA.chips.length - 1 ? (
                <span aria-hidden="true" className="text-xs text-[#787E96]">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <h2 className="mt-10 text-center text-2xl font-bold leading-snug text-white md:mt-14 md:text-[2.5rem]">
          {FINAL_CTA.titleLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 mt-6 text-center leading-relaxed text-[#B9BFD4]">
          {FINAL_CTA.descLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </p>

        <p className="mt-10 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 md:mt-14">
          <span className="text-xsmall14 md:text-xsmall16 font-bold text-[#8E97FF]">
            {FINAL_CTA.priceLabel}
          </span>
          <strong className="text-2xl font-bold text-white md:text-[2rem]">
            {formatKRW(salePrice)}원
          </strong>
        </p>

        <p className="mt-8 text-center">
          <button
            className="text-primary rounded-full bg-white px-10 py-4 text-base font-bold disabled:opacity-50"
            disabled={IS_CTA_DISABLED}
            onClick={() => {
              capturePaymentCtaClicked({ location: 'final_cta' });
              openPlanSheet();
            }}
            type="button"
          >
            {ctaLabel(FINAL_CTA.ctaLabel)}
          </button>
        </p>

        <p className="mt-6 text-center text-xs text-[#787E96] md:text-sm">
          {FINAL_CTA.includes.lead}
          <strong className="font-bold text-[#B9BFD4]">
            {FINAL_CTA.includes.strong}
          </strong>
          {FINAL_CTA.includes.tail}
        </p>
      </div>
    </section>
  );
}
