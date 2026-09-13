import { twMerge } from '@/lib/twMerge';
import type { ChallengePricePlan } from '@/schema';
import { useId } from 'react';
import type { PlanUpgradeOption } from '../api/planUpgradeSchema';
import { formatAdditionalAmount } from '../utils/planUpgradeText';

interface PlanOptionRadioGroupProps {
  options: PlanUpgradeOption[];
  selectedPlan: ChallengePricePlan | null;
  onChange: (plan: ChallengePricePlan) => void;
}

/**
 * 업그레이드할 플랜 선택지.
 *
 * 카드 전체가 label 이라 어디를 눌러도 고른다. 숨긴 native radio 를 써서 화살표 키 이동을
 * 브라우저에 맡긴다. 추천 뱃지는 바로 위 플랜인 첫 항목에만 붙인다 (D18).
 */
const PlanOptionRadioGroup = ({
  options,
  selectedPlan,
  onChange,
}: PlanOptionRadioGroupProps) => {
  const labelId = useId();

  return (
    <section className="flex flex-col gap-2">
      <p id={labelId} className="text-xsmall14 text-neutral-40">
        업그레이드할 플랜
      </p>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="flex flex-col"
      >
        {options.map((option, index) => {
          const isSelected = option.planType === selectedPlan;

          return (
            <label
              key={option.planType}
              className={twMerge(
                'relative flex cursor-pointer gap-3 rounded-md px-4 py-4',
                isSelected && 'bg-primary-5',
              )}
            >
              <input
                type="radio"
                name={labelId}
                value={option.planType}
                checked={isSelected}
                aria-checked={isSelected}
                onChange={() => onChange(option.planType)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={twMerge(
                  'border-neutral-80 peer-focus-visible:ring-primary mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
                  isSelected && 'border-primary',
                )}
              >
                {isSelected && (
                  <span className="bg-primary h-2.5 w-2.5 rounded-full" />
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span className="text-small18 text-neutral-0 font-semibold">
                      {option.planType}
                    </span>
                    {index === 0 && (
                      <span className="rounded-xxs text-xxsmall12 bg-primary-10 text-primary px-2 py-1">
                        추천
                      </span>
                    )}
                  </span>
                  <span
                    className={twMerge(
                      'text-xsmall16 text-neutral-0 font-semibold',
                      isSelected && 'text-primary',
                    )}
                  >
                    {formatAdditionalAmount(option.additionalAmount)}
                  </span>
                </span>
                {option.description && (
                  <span className="text-xsmall14 text-neutral-40">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
};

export default PlanOptionRadioGroup;
