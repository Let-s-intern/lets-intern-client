'use client';

import { useCallback, useState } from 'react';
import PaymentTermsAgreement from './PaymentTermsAgreement';

interface PaymentSubmitSectionProps {
  /** 약관 동의 후 실제 결제 액션 (동의 전에는 호출되지 않는다) */
  onSubmit: () => void;
  /** 결제 버튼 라벨 */
  buttonText: string;
  /** 폼 무효·위젯 미준비 등 외부 사유로 결제를 막을지 여부 */
  disabled?: boolean;
}

/**
 * 결제 제출 영역 — 서비스 이용약관 동의 체크 + 결제 버튼.
 * 모바일(하단 고정)·데스크톱(인라인) 레이아웃을 함께 렌더한다.
 *
 * 약관 동의 상태·미동의 안내·흔들림 피드백을 내부에서 관리하고, 동의 시에만
 * onSubmit을 호출한다. /payment-input·/payment 등에서 공통 사용.
 */
const PaymentSubmitSection = ({
  onSubmit,
  buttonText,
  disabled = false,
}: PaymentSubmitSectionProps) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [attemptedPay, setAttemptedPay] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleToggleTerms = useCallback(() => {
    const nextAgreed = !agreedToTerms;
    setAgreedToTerms(nextAgreed);
    if (nextAgreed) setAttemptedPay(false); // 동의 시 경고 즉시 감춤
  }, [agreedToTerms]);

  const handleClick = useCallback(() => {
    // 약관 미동의면 결제를 막고 안내 노출 + 흔들림. (버튼은 disabled가 아니라
    // 클릭을 받아 가드 — disabled 버튼은 클릭 이벤트가 발생하지 않기 때문.)
    if (!agreedToTerms) {
      setAttemptedPay(true);
      setIsShaking(true);
      return;
    }
    onSubmit();
  }, [agreedToTerms, onSubmit]);

  // 약관 동의 UI + 결제 버튼 (모바일/데스크톱 공통 렌더).
  const content = (
    <>
      <div className="mb-3">
        <PaymentTermsAgreement
          agreed={agreedToTerms}
          onToggle={handleToggleTerms}
          showWarning={attemptedPay}
        />
      </div>
      <button
        // 비활성 표현을 상태별로 구분한다:
        // - disabled(폼 무효·미준비): 회색(disabled:*)으로 완전 비활성.
        // - 약관 미동의(클릭 가능): 브랜드색 + opacity-40으로 뿌옇게(클릭 시 안내).
        // 흔들림은 리마운트(key) 대신 isShaking 클래스 + onAnimationEnd로 처리해 포커스 유실을 막는다.
        className={`next_button border-primary bg-primary disabled:border-neutral-70 disabled:bg-neutral-70 flex w-full items-center justify-center rounded-md border-2 px-6 py-3 text-lg font-medium text-neutral-100 transition ${disabled ? '' : agreedToTerms ? 'hover:opacity-90' : 'opacity-40'} ${isShaking ? 'animate-shake motion-reduce:animate-none' : ''}`}
        onClick={handleClick}
        onAnimationEnd={() => setIsShaking(false)}
        disabled={disabled}
      >
        {buttonText}
      </button>
    </>
  );

  // 단일 DOM 노드에 반응형 클래스로 모바일(하단 고정)·데스크톱(인라인)을 전환한다
  // (content를 두 번 렌더하면 대화형 요소가 DOM에 중복돼 a11y·크기 문제가 생김).
  return (
    <div className="shadow-05 fixed bottom-0 left-0 right-0 rounded-t-lg bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3 md:static md:mx-5 md:rounded-none md:bg-transparent md:px-0 md:pb-0 md:pt-0 md:shadow-none">
      {content}
    </div>
  );
};

export default PaymentSubmitSection;
