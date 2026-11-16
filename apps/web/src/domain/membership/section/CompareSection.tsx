'use client';

import { formatKRW } from '../data/membership';
import { COMPARE } from '../data/compare';
import { useMembershipChallengeData } from '../lib/useMembershipChallengeData';

/**
 * 시안 15 — 가격 비교표 (PRICE COMPARISON).
 *
 * 패스 금액만 어드민 값을 쓴다. 비교 대상 조합은 정적이다 — 자세한 이유는
 * `data/compare.ts` 주석에 있다.
 */
export default function CompareSection() {
  const { salePrice } = useMembershipChallengeData();

  return (
    <section className="bg-neutral-95 py-16 md:py-24" id="compare">
      <div className="wrap">
        <p className="text-center text-sm font-bold tracking-wide text-[#F1642B]">
          {COMPARE.eyebrow}
        </p>

        <h2 className="mt-4 text-center text-2xl font-bold leading-snug text-neutral-0 md:text-[2rem]">
          {COMPARE.titleLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <p className="mt-4 text-center text-xsmall14 text-neutral-40 md:text-xsmall16">
          {COMPARE.sub}
        </p>

        <div className="mt-10 overflow-hidden rounded-xxl md:mt-14">
          {COMPARE.rows.map((row) => (
            <div
              className="flex items-center justify-between gap-4 border-b border-neutral-90 bg-white px-6 py-5 md:px-8"
              key={row.label}
            >
              <span className="text-xsmall14 text-neutral-30 md:text-xsmall16">
                {row.label}
              </span>
              <strong className="shrink-0 text-xsmall16 font-bold text-neutral-0">
                {formatKRW(row.price)}원
              </strong>
            </div>
          ))}

          {/* 패스 줄 — 이 표의 결론이라 색과 굵기로 분리한다 */}
          <div className="flex items-center justify-between gap-4 bg-[#232433] px-6 py-6 md:px-8">
            <span className="text-xsmall14 font-medium text-white md:text-xsmall16">
              {COMPARE.passLabel}
            </span>
            <strong className="shrink-0 text-xl font-bold text-[#F6A780] md:text-2xl">
              {formatKRW(salePrice)}원
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}
