import { clsx } from 'clsx';
import { useState } from 'react';

/**
 * 은행명과 API 코드 매핑.
 *
 * **값은 서버 `AccountType` enum 의 이름과 정확히 같아야 한다.**
 * (`lets-career-server` / `domain/user/type/AccountType.java`)
 *
 * 서버가 이 값을 enum 으로 역직렬화하는데, 목록에 없는 값이 오면
 * `HttpMessageNotReadableException` 이 나고 `GlobalExceptionHandler` 가 그것을
 * 다루지 않아 500 "서버 내부 오류입니다." 로 나간다 — 400 이 아니다.
 *
 * 2026-09-07 에 케이뱅크(`KBANK`)·SC제일은행(`SC`)이 서버에 없는 채로 노출되어
 * 그 둘을 고른 참여자의 블로그 보너스 제출이 100% 실패했다.
 * 원인·재현: `.claude/tasks/prd-260907-LC-3285-블로그-보너스-제출-500.md`
 *
 * 서버에는 있으나 여기 없는 값(수협 `SH`, 새마을금고 `MG`)은 고를 수만 없을 뿐
 * 오류를 내지 않는다. 추가는 별개 작업이다.
 */
export const banks = {
  KB국민은행: 'KB',
  하나은행: 'HANA',
  우리은행: 'WOORI',
  신한은행: 'SHINHAN',
  NH농협은행: 'NH',
  IBK기업은행: 'IBK',
  카카오뱅크: 'KAKAO',
  토스뱅크: 'TOSS',
};

type BankKey = keyof typeof banks;

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

  const bankNames = Object.keys(banks);

  // API 코드를 은행명으로 변환하는 함수
  const getBankNameFromCode = (code: string): string => {
    const bankEntry = Object.entries(banks).find(
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
    const bankCode = banks[bank as BankKey];
    onBankSelect?.(bankCode);
    setIsOpen(false);
  };

  const displayText = displayBankName || '은행 선택';

  return (
    <div className={clsx('relative', className)}>
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* 드롭다운 입력 필드 */}
      <div
        className={clsx(
          'z-10 flex h-[44px] w-full cursor-pointer items-center justify-between md:h-[44px] md:w-[184px]',
          'rounded-xxs hover:border-neutral-60 border bg-white px-3 py-2.5 transition-colors',
          'focus-within:border-primary focus-within:outline-none',
          isOpen ? 'border-primary' : 'border-neutral-80',
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
        <div className="rounded-xxs border-neutral-80 absolute top-full z-10 mt-2 w-full border bg-white shadow-lg md:w-[184px]">
          <div className="scrollbar-hide max-h-[204px] overflow-y-auto">
            {bankNames.map((bank, index) => (
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
                {index < bankNames.length - 1 && (
                  <div className="bg-neutral-90 h-px" />
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
