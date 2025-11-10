import { twMerge } from '@/lib/twMerge';

// TODO: props로 variant 등 추가 예정
interface OutlinedButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const OutlinedButton = ({
  children,
  onClick,
  icon,
  className,
}: OutlinedButtonProps) => {
  return (
    <button
      className={twMerge(
        'flex cursor-pointer items-center justify-center gap-1 rounded-xxs border border-primary px-3 py-1.5 text-primary hover:bg-neutral-100',
        className,
      )}
      onClick={onClick}
    >
      {icon}
      <span className="text-sm font-medium">{children}</span>
    </button>
  );
};

export default OutlinedButton;
