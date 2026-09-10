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

        <h2 className="text-neutral-0 mt-4 text-center text-2xl font-bold leading-snug md:text-[2rem]">
          {COMPARE.titleLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4 text-center">
          {COMPARE.sub}
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl md:mt-14">
          {COMPARE.rows.map((row) => (
            <div
              className="border-neutral-90 flex items-center justify-between gap-4 border-b bg-white px-6 py-5 md:px-8"
              key={row.label}
            >
              <span className="text-xsmall14 md:text-xsmall16 text-neutral-30">
                {row.label}
              </span>
              <strong className="text-xsmall16 text-neutral-0 shrink-0 font-bold">
                {formatKRW(row.price)}원
              </strong>
            </div>
          ))}

          {/* 패스 줄 — 이 표의 결론이라 색과 굵기로 분리한다 */}
          <div className="flex items-center justify-between gap-4 bg-[#232433] px-6 py-6 md:px-8">
            <span className="text-xsmall14 md:text-xsmall16 font-medium text-white">
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
