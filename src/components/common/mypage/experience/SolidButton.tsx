import { twMerge } from '@/lib/twMerge';

// TODO: props로 variant 등 추가 예정
interface SolidButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const SolidButton = ({
  children,
  onClick,
  icon,
  className,
}: SolidButtonProps) => {
  return (
    <button
      className={twMerge(
        'cursor-pointer items-center justify-center gap-1 rounded-xs bg-primary-10 px-3 py-2 text-primary hover:bg-primary-15',
        className,
      )}
      onClick={onClick}
    >
      {icon}
      <span className="text-sm font-medium">{children}</span>
    </button>
  );
};

export default SolidButton;
