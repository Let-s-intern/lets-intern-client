import { twMerge } from '@/lib/twMerge';
import { ReactNode, useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';

interface Props {
  label: string;
  children?: ReactNode;
  initialOpenState?: boolean;
  labelId?: string;
  wrapperClassName?: string;
}

function OptionDropdown({
  label,
  children,
  initialOpenState = true,
  labelId,
  wrapperClassName,
}: Props) {
  const [isOpen, setIsOpen] = useState(initialOpenState);

  return (
    <div
      className={twMerge(
        'rounded-xs border-neutral-80 overflow-hidden border',
        wrapperClassName,
      )}
    >
      <div
        className="text-xsmall14 text-static-0 flex cursor-pointer items-center justify-between bg-neutral-100 p-3 font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <label id={labelId}>{label}</label>
        {isOpen ? (
          <HiChevronUp className="h-auto w-5" color="#ACAFB6" />
        ) : (
          <HiChevronDown className="h-auto w-5" color="#ACAFB6" />
        )}
      </div>

      {isOpen && children}
    </div>
  );
}

export default OptionDropdown;
