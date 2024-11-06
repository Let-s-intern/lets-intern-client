import { twMerge } from '@/lib/twMerge';

interface GradientButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function GradientButton({
  children,
  disabled,
  onClick,
  className,
}: GradientButtonProps) {
  return (
    <button
      className={twMerge(
        'py-2.4 rounded-sm border border-primary-80 bg-slate-600 bg-gradient-to-r from-[#4B53FF] to-[#763CFF] px-5 py-3 text-xsmall14 font-semibold text-static-100',
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
