import { clsx } from 'clsx';

interface AgreementCheckboxProps {
  className?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const AgreementCheckbox = ({
  className,
  checked,
  onCheckedChange,
  disabled = false,
  children,
}: AgreementCheckboxProps) => {
  const handleClick = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  return (
    <div
      className={clsx('flex items-center gap-1', className)}
      onClick={handleClick}
    >
      {/* 체크박스 */}
      <div
        className={clsx(
          'flex h-4 w-4 cursor-pointer items-center justify-center',
          'rounded-xxs border transition-colors',
          checked ? 'border-primary bg-primary' : 'border-neutral-60 bg-white',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* 텍스트 */}
      <span
        className={clsx(
          'cursor-pointer select-none text-xsmall14 text-neutral-0',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {children || '리워드 지급을 위한 개인정보 활용에 동의합니다.'}
      </span>
    </div>
  );
};

export default AgreementCheckbox;
