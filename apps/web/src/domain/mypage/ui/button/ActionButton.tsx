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
      'rounded-xxs text-xsmall14 border px-3 py-1.5 font-normal transition-colors',
      disabled
        ? 'border-neutral-80 cursor-not-allowed text-neutral-50'
        : 'border-primary text-primary hover:bg-primary/5',
      variant === 'mobile' ? 'w-full md:hidden' : 'hidden shrink-0 md:block',
    )}
  >
    {label}
  </button>
);

export default ActionButton;
