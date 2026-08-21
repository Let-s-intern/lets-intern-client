'use client';

import type { LiveMentoringDuration } from '@/api/live-mentoring/liveMentoringSchema';
import { formatPrice } from '../../constants';
import { planLabel } from '../constants';

interface PriceSummarySectionProps {
  /** 고른 플랜. 아직 안 골랐으면 null. */
  selected: { duration: LiveMentoringDuration; price: number } | null;
  /** 삭제 버튼 — 플랜 선택과 슬롯 선택이 함께 풀린다. */
  onRemove: () => void;
}

/**
 * 총 결제 금액 (시안 `1-0` 마지막 섹션).
 *
 * 플랜은 하나만 고를 수 있으므로 행도 하나다. 합계는 그 행의 금액과 같지만 줄을
 * 따로 둔다 — 시안이 그렇고, 쿠폰이 붙는 자리가 여기다(Push 3).
 */
const PriceSummarySection = ({
  selected,
  onRemove,
}: PriceSummarySectionProps) => {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xsmall16 text-neutral-0 font-semibold">
        총 결제 금액
      </h3>

      {selected === null ? (
        <p className="bg-neutral-95 text-xsmall14 text-neutral-40 rounded-sm px-4 py-5 text-center">
          플랜을 선택하면 결제 금액이 표시됩니다.
        </p>
      ) : (
        <div className="bg-neutral-95 flex items-start justify-between gap-3 rounded-sm px-4 py-4">
          <span className="text-xsmall14 text-neutral-0">
            {planLabel(selected.duration)}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xsmall16 text-neutral-0 font-bold">
              {formatPrice(selected.price)}
            </span>
            <button
              type="button"
              onClick={onRemove}
              aria-label="선택한 플랜 삭제"
              className="text-neutral-45 hover:text-neutral-30 text-xsmall16 leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="border-neutral-85 flex items-center justify-end border-t pt-3">
        <span className="text-small18 text-neutral-0 font-bold">
          {formatPrice(selected?.price ?? 0)}
        </span>
      </div>
    </section>
  );
};

export default PriceSummarySection;
