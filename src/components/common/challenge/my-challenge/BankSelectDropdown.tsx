import { clsx } from 'clsx';
import { useState } from 'react';

interface BankSelectDropdownProps {
  className?: string;
  selectedBank?: string;
  onBankSelect?: (bank: string) => void;
  disabled?: boolean;
}

const BankSelectDropdown = ({
  className,
  selectedBank,
  onBankSelect,
  disabled = false,
}: BankSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const banks = [
    '신한은행',
    'KB국민은행',
    '우리은행',
    '하나은행',
    'NH농협은행',
    '기업은행',
    'SC제일은행',
    '케이뱅크',
    '카카오뱅크',
  ];

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleBankSelect = (bank: string) => {
    onBankSelect?.(bank);
    setIsOpen(false);
  };

  const displayText = selectedBank || '은행 선택';

  return (
    <div className={clsx('relative', className)}>
      {/* 드롭다운 입력 필드 */}
      <div
        className={clsx(
          'flex h-[44px] w-[184px] cursor-pointer items-center justify-between',
          'rounded-xxs border border-neutral-80 bg-white px-3 py-2.5',
          'transition-colors hover:border-neutral-60',
          'focus-within:border-primary focus-within:outline-none',
          disabled && 'cursor-not-allowed bg-neutral-100 text-neutral-50',
        )}
        onClick={handleToggle}
      >
        <span
          className={clsx(
            'text-xsmall16',
            selectedBank ? 'text-neutral-0' : 'text-neutral-50',
          )}
        >
          {displayText}
        </span>
        <div
          className={clsx(
            'h-4 w-4 transition-transform',
            isOpen ? 'rotate-180' : 'rotate-0',
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* 드롭다운 목록 */}
      {isOpen && !disabled && (
        <div className="absolute top-full z-10 mt-1 w-[184px] rounded-xxs border border-neutral-80 bg-white shadow-lg">
          <div className="max-h-[204px] overflow-y-auto scrollbar-hide">
            {banks.map((bank, index) => (
              <div key={bank}>
                <div
                  className={clsx(
                    'flex cursor-pointer items-center justify-between px-3 py-2.5',
                    'text-xsmall16 text-neutral-0 transition-colors',
                    'hover:bg-neutral-95',
                    selectedBank === bank && 'bg-primary-5 text-primary',
                  )}
                  onClick={() => handleBankSelect(bank)}
                >
                  <span>{bank}</span>
                  {selectedBank === bank && (
                    <div className="h-4 w-4">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.3333 4L6 11.3333L2.66667 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {index < banks.length - 1 && (
                  <div className="h-px bg-neutral-80" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BankSelectDropdown;
