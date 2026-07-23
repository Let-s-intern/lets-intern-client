'use client';

// 회원가입 동의(AgreementSection)·footer와 동일한 서비스 이용약관 노션 URL.
const TERMS_URL =
  'https://letsintern.notion.site/251208-2c35e77cbee1800bb2b5cfbd4c2f1525?pvs=21';

interface PaymentTermsAgreementProps {
  agreed: boolean;
  onToggle: () => void;
  /** 미동의 상태에서 결제를 시도해 안내를 노출할지 여부 */
  showWarning: boolean;
}

/**
 * 결제 버튼 위 서비스 이용약관 동의 체크박스.
 * 미동의 상태로 결제를 누르면 showWarning=true 로 안내 문구를 띄운다.
 * "서비스 이용약관" 클릭 시 노션 약관 페이지를 새 창으로 연다.
 */
const PaymentTermsAgreement = ({
  agreed,
  onToggle,
  showWarning,
}: PaymentTermsAgreementProps) => (
  <div className="flex flex-col gap-1">
    {/* 토글 버튼(체크박스)과 약관 링크는 형제로 둔다(button 중첩 불가).
        체크박스는 우측 하단 정렬(items-end + justify-between).
        텍스트 영역도 클릭하면 토글되도록 하고, 링크 클릭은 전파를 막아 약관만 연다. */}
    <div className="flex items-end justify-between gap-2">
      <label
        className="text-xsmall14 md:text-xsmall16 text-neutral-0 cursor-pointer select-none break-keep"
        onClick={onToggle}
      >
        [필수]{' '}
        {/* 나머지를 nowrap 한 덩어리로 묶어, 한 줄에 안 들어갈 때만 [필수]와 나머지
            사이에서 줄바꿈된다(들어가면 한 줄, 넘치면 [필수] / 나머지). */}
        <span className="whitespace-nowrap">
          <a
            href={TERMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            서비스 이용약관
          </a>{' '}
          및 취소·환불 정책에 동의합니다.
        </span>
      </label>
      <button
        type="button"
        onClick={onToggle}
        aria-checked={agreed}
        role="checkbox"
        aria-label="서비스 이용약관 및 취소·환불 정책 동의"
      >
        {/* 선명하게 보이도록 primary 톤 아이콘 사용(미체크=primary 테두리 박스). */}
        <img
          src={
            agreed
              ? '/icons/checkbox-fill.svg'
              : '/icons/checkbox-unchecked-box3.svg'
          }
          alt=""
          aria-hidden
          className="h-6 w-6 flex-shrink-0"
        />
      </button>
    </div>
    {showWarning && !agreed && (
      <p className="text-requirement text-xsmall14">
        서비스 이용약관에 동의해 주세요.
      </p>
    )}
  </div>
);

export default PaymentTermsAgreement;
