'use client';

interface CouponSectionProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  appliedCode: string | null;
  onRegister: () => void;
  onClear: () => void;
}

/**
 * 쿠폰 등록 (시안 `2-0` 의 "결제 정보").
 *
 * 등록해도 이 화면에서는 검증되지 않는다. 서버가 신청 생성 시점에 확인하므로
 * 잘못된 코드는 `결제하기` 를 누를 때 걸러진다 — 그 사실을 문구로 알린다.
 * 조용히 넘겼다가 결제 직전에 튕기면 사용자는 무엇이 잘못됐는지 알 수 없다.
 */
const CouponSection = ({
  inputValue,
  onInputChange,
  appliedCode,
  onRegister,
  onClear,
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
              disabled={inputValue.trim().length === 0}
              className="bg-primary text-xsmall14 disabled:bg-neutral-80 disabled:text-neutral-40 shrink-0 rounded-sm px-5 py-3 font-medium text-white"
            >
              쿠폰 등록
            </button>
          </div>
          <p className="text-xxsmall12 text-neutral-45">
            * 쿠폰은 결제하기를 누를 때 확인됩니다. 사용할 수 없는 쿠폰이면 그때
            알려드려요.
          </p>
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
