'use client';

interface CouponSectionProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  appliedCode: string | null;
  onRegister: () => void;
  onClear: () => void;
  /** 서버가 거절한 사유. 등록 시점에 바로 보여준다. */
  errorMessage?: string | null;
  /** 검증 요청 중에는 버튼을 잠근다. */
  isValidating?: boolean;
}

/**
 * 쿠폰 등록 (시안 `2-0` 의 "결제 정보").
 *
 * 등록을 누르면 서버(`GET /coupon`)가 신청 생성과 같은 검증을 태워 즉시 판정한다.
 * 쓸 수 없는 쿠폰이면 그 자리에서 사유를 보여주고, 통과하면 할인 금액이
 * `PriceSection` 에 바로 반영된다. 결제 직전에 처음 튕기면 사용자는 무엇이
 * 잘못됐는지 알 수 없다.
 */
const CouponSection = ({
  inputValue,
  onInputChange,
  appliedCode,
  onRegister,
  onClear,
  errorMessage = null,
  isValidating = false,
}: CouponSectionProps) => {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xsmall16 text-neutral-0 font-semibold">결제 정보</h2>

      {appliedCode === null ? (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              aria-label="쿠폰 번호"
              value={inputValue}
              maxLength={100}
              onChange={(event) => onInputChange(event.target.value)}
              placeholder="쿠폰 번호를 입력해주세요."
              className="bg-neutral-95 text-xsmall14 text-neutral-0 flex-1 rounded-sm px-4 py-3"
            />
            <button
              type="button"
              onClick={onRegister}
              disabled={inputValue.trim().length === 0 || isValidating}
              className="bg-primary text-xsmall14 disabled:bg-neutral-80 disabled:text-neutral-40 shrink-0 rounded-sm px-5 py-3 font-medium text-white"
            >
              {isValidating ? '확인 중...' : '쿠폰 등록'}
            </button>
          </div>
          {errorMessage !== null && (
            <p role="alert" className="text-xxsmall12 text-system-error">
              {errorMessage}
            </p>
          )}
        </>
      ) : (
        <div className="border-neutral-80 flex items-center justify-between gap-3 rounded-sm border px-4 py-3">
          <span className="text-xsmall14 text-neutral-0">
            쿠폰 <span className="font-semibold">{appliedCode}</span> 등록됨
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-xsmall14 text-neutral-45 underline"
          >
            해제
          </button>
        </div>
      )}
    </section>
  );
};

export default CouponSection;
