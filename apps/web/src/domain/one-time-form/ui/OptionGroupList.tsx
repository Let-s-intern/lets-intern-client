import type {
  OneTimeFormOption,
  OneTimeFormOptionGroup,
} from '@/api/one-time-form/oneTimeFormSchema';
import { twMerge } from '@/lib/twMerge';
import { Check } from 'lucide-react';
import { formatAdditionalPrice } from '../utils/optionSelection';

interface OptionGroupListProps {
  optionGroups: OneTimeFormOptionGroup[];
  selectedOptionIds: number[];
  onSelect: (group: OneTimeFormOptionGroup, optionId: number) => void;
}

/** 결제 옵션 그룹. SINGLE 은 카드형 라디오, MULTIPLE 은 카드형 체크박스 */
const OptionGroupList = ({
  optionGroups,
  selectedOptionIds,
  onSelect,
}: OptionGroupListProps) => {
  return (
    <>
      {optionGroups.map((group) => (
        <fieldset key={group.optionGroupId} className="mt-7">
          <legend className="text-xsmall16 font-bold">
            {group.title}
            {group.isRequired ? (
              <span className="text-requirement ml-0.5">*</span>
            ) : null}
          </legend>
          {group.description ? (
            <p className="text-xxsmall12 text-neutral-40 mt-1">
              {group.description}
            </p>
          ) : null}
          <div className="mt-2 grid gap-2">
            {group.options.map((option) => (
              <OptionCard
                key={option.optionId}
                group={group}
                option={option}
                checked={selectedOptionIds.includes(option.optionId)}
                onSelect={onSelect}
              />
            ))}
          </div>
        </fieldset>
      ))}
    </>
  );
};

interface OptionCardProps {
  group: OneTimeFormOptionGroup;
  option: OneTimeFormOption;
  checked: boolean;
  onSelect: OptionGroupListProps['onSelect'];
}

const OptionCard = ({ group, option, checked, onSelect }: OptionCardProps) => {
  const isSingle = group.selectType === 'SINGLE';

  return (
    <label
      className={twMerge(
        'border-neutral-80 hover:border-neutral-70 focus-within:ring-primary-10 flex min-h-12 cursor-pointer items-start gap-2.5 rounded-sm border px-3.5 py-3 transition-colors focus-within:ring-[3px]',
        checked && 'border-primary bg-primary-5 hover:border-primary',
      )}
    >
      <input
        type={isSingle ? 'radio' : 'checkbox'}
        name={`option-group-${group.optionGroupId}`}
        checked={checked}
        onChange={() => onSelect(group, option.optionId)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={twMerge(
          'border-neutral-70 bg-static-100 mt-px grid h-5 w-5 flex-none place-items-center border-[1.5px]',
          isSingle ? 'rounded-full' : 'rounded-xxs',
          checked &&
            (isSingle
              ? 'border-primary border-[6px]'
              : 'border-primary bg-primary'),
        )}
      >
        {checked && !isSingle ? (
          <Check size={12} strokeWidth={3.2} className="text-static-100" />
        ) : null}
      </span>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-xsmall14 font-semibold">
          {option.name}
          {option.badge ? (
            <span className="bg-primary-10 text-xxsmall10 text-primary rounded-xxs ml-1 inline-block px-1.5 py-px align-middle font-bold">
              {option.badge}
            </span>
          ) : null}
        </span>
        {option.description ? (
          <span className="text-xxsmall12 text-neutral-40">
            {option.description}
          </span>
        ) : null}
      </span>
      <span
        className={twMerge(
          'text-xsmall14 text-neutral-20 flex-none font-semibold',
          checked && 'text-primary',
        )}
      >
        {formatAdditionalPrice(option.additionalPrice)}
      </span>
    </label>
  );
};

export default OptionGroupList;
