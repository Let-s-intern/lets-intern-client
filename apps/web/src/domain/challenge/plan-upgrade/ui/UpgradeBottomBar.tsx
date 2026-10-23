import { twMerge } from '@/lib/twMerge';

interface UpgradeBottomBarProps {
  buttonText: string;
  onClick: () => void;
  disabled?: boolean;
}

/**
 * 업그레이드 화면 하단 버튼.
 *
 * 신청 입력 결제 버튼(PaymentSubmitSection)과 같은 클래스다. 모바일은 하단 고정, md 부터
 * 본문 흐름에 놓인다. 약관 동의는 결제 단계에서 받으므로 버튼만 둔다.
 */
const UpgradeBottomBar = ({
  buttonText,
  onClick,
  disabled = false,
}: UpgradeBottomBarProps) => (
  <div className="shadow-05 fixed bottom-0 left-0 right-0 rounded-t-lg bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3 md:static md:mx-5 md:rounded-none md:bg-transparent md:px-0 md:pb-0 md:pt-0 md:shadow-none">
    <button
      type="button"
      className={twMerge(
        'border-primary bg-primary disabled:border-neutral-70 disabled:bg-neutral-70 flex w-full items-center justify-center rounded-md border-2 px-6 py-3 text-lg font-medium text-neutral-100 transition',
        !disabled && 'hover:opacity-90',
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </button>
  </div>
);

export default UpgradeBottomBar;
