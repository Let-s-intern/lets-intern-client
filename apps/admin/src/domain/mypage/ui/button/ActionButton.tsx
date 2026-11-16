import { twMerge } from '@/lib/twMerge';

interface ActionButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  variant: 'mobile' | 'desktop';
}

const ActionButton = ({
  label,
  disabled = false,
  onClick,
  variant,
}: ActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={twMerge(
      'rounded-xxs border px-3 py-1.5 text-xsmall14 font-normal transition-colors',
      disabled
        ? 'cursor-not-allowed border-neutral-80 text-neutral-50'
        : 'border-primary text-primary hover:bg-primary/5',
      variant === 'mobile' ? 'w-full md:hidden' : 'hidden shrink-0 md:block',
    )}
  >
    {label}
  </button>
);

export default ActionButton;
