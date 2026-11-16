'use client';

import type { LiveMentoringDuration } from '@/api/live-mentoring/liveMentoringSchema';
import { formatPrice } from '../../constants';
import { planLabel } from '../constants';

interface PriceSummarySectionProps {
  /** 고른 플랜. 아직 안 골랐으면 null. */
  selected: { duration: LiveMentoringDuration; price: number } | null;
  /** 삭제 버튼 — 플랜 선택과 슬롯 선택이 함께 풀린다. */
}

/**
 * 총 결제 금액 (시안 `1-0` 마지막 섹션).
 *
 * 플랜은 하나만 고를 수 있으므로 행도 하나다. 합계는 그 행의 금액과 같지만 줄을
 * 따로 둔다 — 시안이 그렇고, 쿠폰이 붙는 자리가 여기다(Push 3).
 */
const PriceSummarySection = ({ selected }: PriceSummarySectionProps) => {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xsmall16 font-semibold text-neutral-0">
        총 결제 금액
      </h3>

      {selected === null ? (
        <p className="rounded-sm bg-neutral-95 px-4 py-5 text-center text-xsmall14 text-neutral-40">
          플랜을 선택하면 결제 금액이 표시됩니다.
        </p>
      ) : (
        <div className="flex items-start justify-between gap-3 rounded-sm bg-neutral-95 px-4 py-4">
          <span className="text-xsmall14 text-neutral-0">
            {planLabel(selected.duration)}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xsmall16 font-bold text-neutral-0">
              {formatPrice(selected.price)}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end border-t border-neutral-85 pt-3">
        <span className="text-small18 font-bold text-neutral-0">
          {formatPrice(selected?.price ?? 0)}
        </span>
      </div>
    </section>
  );
};

export default PriceSummarySection;
