import { twMerge } from '@/lib/twMerge';
import { Check } from 'lucide-react';

interface ChoiceCardProps {
  id?: string;
  type: 'radio' | 'checkbox';
  name: string;
  label: string;
  checked: boolean;
  hasError: boolean;
  onChange: () => void;
  onBlur: () => void;
}

/** 시안 .choice. 카드형 라디오·체크박스 한 줄 */
const ChoiceCard = ({
  id,
  type,
  name,
  label,
  checked,
  hasError,
  onChange,
  onBlur,
}: ChoiceCardProps) => {
  const isRadio = type === 'radio';

  return (
    <label
      className={twMerge(
        'border-neutral-80 text-xsmall14 hover:border-neutral-70 focus-within:ring-primary-10 flex min-h-12 cursor-pointer items-center gap-2.5 rounded-sm border px-3.5 py-3 transition-colors focus-within:ring-[3px]',
        hasError && !checked && 'border-requirement',
        checked &&
          'border-primary bg-primary-5 hover:border-primary font-semibold',
      )}
    >
      <input
        id={id}
        type={type}
        name={name}
        value={label}
        checked={checked}
        aria-invalid={hasError}
        onChange={onChange}
        onBlur={onBlur}
        className="sr-only"
      />
      <span
        aria-hidden
        className={twMerge(
          'border-neutral-70 bg-static-100 grid h-5 w-5 flex-none place-items-center border-[1.5px]',
          isRadio ? 'rounded-full' : 'rounded-xxs',
          checked &&
            (isRadio
              ? 'border-primary border-[6px]'
              : 'border-primary bg-primary'),
        )}
      >
        {checked && !isRadio ? (
          <Check size={12} strokeWidth={3.2} className="text-static-100" />
        ) : null}
      </span>
      {label}
    </label>
  );
};

export default ChoiceCard;
