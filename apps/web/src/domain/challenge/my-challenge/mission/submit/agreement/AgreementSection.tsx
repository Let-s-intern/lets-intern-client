import AgreementCheckbox from '@/domain/challenge/my-challenge/mission/submit/agreement/AgreementCheckbox';
import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

const DescriptionBox = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    className={twMerge(
      'rounded-xxs bg-neutral-95 text-xsmall14 text-neutral-10 p-3',
      className,
    )}
  >
    {children}
  </p>
);

interface AgreementSectionProps {
  title: string;
  description: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  checkboxLabel?: ReactNode;
}

export default function AgreementSection({
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
  checkboxLabel,
}: AgreementSectionProps) {
  return (
    <div className="mt-7 flex flex-col gap-1">
      <span className="text-xsmall16 text-neutral-0 font-semibold">
        {title}
      </span>
      <DescriptionBox>{description}</DescriptionBox>
      <div className="mt-2">
        <AgreementCheckbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        >
          {checkboxLabel}
        </AgreementCheckbox>
      </div>
    </div>
  );
}
