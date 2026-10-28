import { ChevronLeft, X } from 'lucide-react';
import { ReactNode } from 'react';

export interface FormPopupStep {
  current: number;
  total: number;
}

interface FormPopupShellProps {
  /** 상단 바 제목. 예: "신청서 작성", "결제하기" */
  title: string;
  /** 유료 폼 단계. 없으면 단계 표시와 진행 막대를 그리지 않는다(무료 폼, 완료 화면) */
  step?: FormPopupStep;
  /** 있으면 제목 왼쪽에 이전 버튼을 그린다(결제 단계) */
  onBack?: () => void;
  /** 하단 고정 버튼 영역 */
  footer?: ReactNode;
  children: ReactNode;
}

const closePopup = () => window.close();

/**
 * 일회성 폼 팝업 틀. 480px 이하는 화면을 꽉 채우고, 넓으면 최대 폭 480 카드로 가운데에 둔다.
 * 본문만 스크롤되고 상단 바와 하단 버튼은 고정이다.
 */
const FormPopupShell = ({
  title,
  step,
  onBack,
  footer,
  children,
}: FormPopupShellProps) => {
  return (
    <div className="bg-neutral-95 flex min-h-dvh justify-center min-[481px]:items-center min-[481px]:py-6">
      <div className="bg-static-100 min-[481px]:shadow-05 flex h-dvh w-full max-w-[480px] flex-col overflow-hidden min-[481px]:h-[calc(100dvh-48px)] min-[481px]:rounded-lg">
        <header className="border-neutral-85 flex h-14 flex-none items-center justify-between border-b pl-5 pr-2">
          <div className="flex items-center">
            {onBack ? (
              <button
                type="button"
                aria-label="이전"
                onClick={onBack}
                className="text-neutral-35 hover:bg-neutral-95 -ml-3.5 grid h-10 w-10 place-items-center rounded-sm"
              >
                <ChevronLeft size={22} />
              </button>
            ) : null}
            <h1 className="text-xsmall16 font-semibold">{title}</h1>
            {step ? (
              <span className="text-xxsmall12 text-neutral-40 ml-2 font-medium">
                {step.current}/{step.total}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={closePopup}
            className="text-neutral-35 hover:bg-neutral-95 grid h-10 w-10 place-items-center rounded-sm"
          >
            <X size={22} />
          </button>
        </header>
        {step ? (
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={step.total}
            aria-valuenow={step.current}
            className="bg-neutral-90 h-[3px] flex-none"
          >
            <div
              className="bg-primary h-full transition-[width]"
              style={{ width: `${(step.current / step.total) * 100}%` }}
            />
          </div>
        ) : null}
        <main className="flex-1 overflow-y-auto px-5 pb-6 pt-5">
          {children}
        </main>
        {footer ? (
          <footer className="border-neutral-85 bg-static-100 flex-none border-t px-5 pb-5 pt-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
};

export default FormPopupShell;
