'use client';

import type {
  LiveMentorDetail,
  LiveMentoringDuration,
} from '@/api/live-mentoring/liveMentoringSchema';
import { formatPrice } from '../../constants';
import { planLabel } from '../constants';

interface PlanSelectSectionProps {
  /** 플랜 묶음 이름으로 쓸 상품명. */
  productTitle: string;
  durationPrices: LiveMentorDetail['durationPrices'];
  selectedDuration: LiveMentoringDuration | null;
  onSelect: (duration: LiveMentoringDuration) => void;
}

/**
 * 1:1 멘토링 플랜 선택 (시안 `1-0` 첫 섹션).
 *
 * 서버 `durationPrices[].price` 가 그대로 판매가다. 시안에 있는 **정가 취소선·할인율
 * 배지·`3개 남음` 재고 문구는 그리지 않는다** — 근거 데이터가 없다. 상세 응답의
 * `productDiscount` 는 0 고정이고, 정원이나 잔여 수량 개념은 서버에 아예 없다.
 * 없는 숫자를 화면에 띄우면 그 자리에서 거짓말이 되므로 자리도 잡지 않는다.
 * (PRD 7-1·4-5 결정 후 되살릴 것)
 *
 * 시안의 접기 화살표도 넣지 않았다. 항목이 둘뿐이라 접을 것이 없다.
 */
const PlanSelectSection = ({
  productTitle,
  durationPrices,
  selectedDuration,
  onSelect,
}: PlanSelectSectionProps) => {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xsmall16 text-neutral-0 font-semibold">
        1:1 멘토링 플랜 선택 <span className="text-primary">(필수)</span>
      </h3>

      <div className="border-neutral-80 divide-neutral-85 flex flex-col divide-y rounded-sm border">
        <p className="bg-neutral-95 text-xsmall14 text-neutral-20 rounded-t-sm px-4 py-3 font-semibold">
          {productTitle}
        </p>

        {durationPrices.map((option) => (
          <label
            key={option.duration}
            className="flex cursor-pointer items-center justify-between gap-3 px-4 py-4"
          >
            <span className="text-xsmall14 text-neutral-0 flex items-center gap-2.5">
              <input
                type="radio"
                name="live-mentoring-plan"
                value={option.duration}
                checked={selectedDuration === option.duration}
                onChange={() => onSelect(option.duration)}
                className="accent-primary h-4 w-4"
              />
              {planLabel(option.duration)}
            </span>
            <span className="text-xsmall16 text-neutral-0 font-bold">
              {formatPrice(option.price)}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
};

export default PlanSelectSection;
