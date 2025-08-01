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

  // 은행명과 API 코드 매핑
  const bankMapping = {
    KB국민은행: 'KB',
    하나은행: 'HANA',
    우리은행: 'WOORI',
    신한은행: 'SHINHAN',
    NH농협은행: 'NH',
    수협은행: 'SH',
    IBK기업은행: 'IBK',
    새마을금고: 'MG',
    카카오뱅크: 'KAKAO',
    토스뱅크: 'TOSS',
  };

  const banks = [
    '신한은행',
    'KB국민은행',
    '우리은행',
    '하나은행',
    'NH농협은행',
    'IBK기업은행',
    '수협은행',
    '새마을금고',
    '카카오뱅크',
    '토스뱅크',
  ];

  // API 코드를 은행명으로 변환하는 함수
  const getBankNameFromCode = (code: string): string => {
    const bankEntry = Object.entries(bankMapping).find(
      ([_, bankCode]) => bankCode === code,
    );
    return bankEntry ? bankEntry[0] : '';
  };

  // 현재 선택된 은행의 표시명 (API 코드가 있으면 은행명으로 변환)
  const displayBankName = selectedBank
    ? getBankNameFromCode(selectedBank) || selectedBank
    : '';

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleBankSelect = (bank: string) => {
    // 은행명을 API 코드로 변환하여 전달
    const bankCode = bankMapping[bank as keyof typeof bankMapping];
    onBankSelect?.(bankCode);
    setIsOpen(false);
  };

  const displayText = displayBankName || '은행 선택';

  return (
    <div className={clsx('relative', className)}>
      {/* 드롭다운 입력 필드 */}
      <div
        className={clsx(
          'flex h-[44px] w-full cursor-pointer items-center justify-between md:h-[44px] md:w-[184px]',
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
            displayBankName ? 'text-neutral-0' : 'text-neutral-50',
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
        <div className="absolute top-full z-10 mt-2 w-[184px] rounded-xxs border border-neutral-80 bg-white shadow-lg">
          <div className="max-h-[204px] overflow-y-auto scrollbar-hide">
            {banks.map((bank, index) => (
              <div key={bank}>
                <div
                  className={clsx(
                    'flex cursor-pointer items-center justify-between px-3 py-2.5',
                    'text-xsmall16 text-neutral-0 transition-colors',
                    'hover:bg-neutral-95',
                    displayBankName === bank && 'bg-primary-5 text-primary',
                  )}
                  onClick={() => handleBankSelect(bank)}
                >
                  <span>{bank}</span>
                  {displayBankName === bank && (
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
