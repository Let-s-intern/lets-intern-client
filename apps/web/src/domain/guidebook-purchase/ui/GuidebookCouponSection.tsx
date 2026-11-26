'use client';

// 구매 팝업 안에서 펼치는 쿠폰 영역. 모달 없이 카드 안에서 코드 등록, 보유 쿠폰 선택, 해제를 한다.
// 선택 상태는 부모가 가진다(selectedCouponId). 조회가 실패하면 부모 값이 비워져 선택도 풀린다.
import {
  CouponItem,
  useMyCoupons,
  useRegisterCoupon,
} from '@/api/coupon/coupon';
import { useApplyCoupon } from '@/domain/program/program-detail/apply/hooks/useApplyCoupon';
import { ICouponForm } from '@/types/interface';
import { useState } from 'react';

const PROGRAM_TYPE = 'GUIDEBOOK';

const discountLabel = (coupon: CouponItem) =>
  coupon.discount === -1
    ? '전액 할인'
    : coupon.discountType === 'RATE'
      ? `${coupon.discount}% 할인`
      : `${coupon.discount.toLocaleString()}원 할인`;

export default function GuidebookCouponSection({
  amount,
  selectedCouponId,
  onChange,
}: {
  amount: number;
  selectedCouponId: number | null;
  onChange: (coupon: ICouponForm) => void;
}) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const { data: coupons = [] } = useMyCoupons(PROGRAM_TYPE);
  const {
    register,
    isPending: isRegistering,
    errorMessage: registerError,
    clearError,
  } = useRegisterCoupon(() => setCode(''));
  const { applyCoupon, applyError } = useApplyCoupon({
    programType: PROGRAM_TYPE,
    maxAmount: amount,
    salePrice: amount,
    setCoupon: onChange,
  });

  const selected = coupons.find((c) => c.couponId === selectedCouponId);

  const handleSelect = (coupon: CouponItem) => {
    if (coupon.couponId === selectedCouponId) {
      onChange({ id: null, price: 0 });
      return;
    }
    applyCoupon(coupon.code);
  };

  return (
    <div className="flex flex-col gap-2 rounded-md bg-neutral-95 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xsmall14 font-medium">
          쿠폰
          {selected && (
            <span className="ml-2 font-normal text-neutral-30">
              {selected.name}
            </span>
          )}
        </span>
        <span className="flex gap-3 text-xsmall14">
          {selected && (
            <button
              type="button"
              className="text-neutral-45"
              onClick={() => onChange({ id: null, price: 0 })}
            >
              쿠폰 해제
            </button>
          )}
          <button
            type="button"
            className="text-primary"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? '접기' : '쿠폰 사용'}
          </button>
        </span>
      </div>

      {open && (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                clearError();
              }}
              placeholder="쿠폰 코드를 입력해주세요."
              className="min-w-0 flex-1 rounded-md bg-neutral-100 p-2 text-xsmall14 outline-none placeholder:text-neutral-45"
            />
            <button
              type="button"
              className="shrink-0 rounded-md bg-primary px-4 text-xsmall14 text-neutral-100 disabled:opacity-50"
              disabled={!code.trim() || isRegistering}
              onClick={() => register(code)}
            >
              등록하기
            </button>
          </div>
          {registerError && (
            <span className="text-xxsmall12 text-system-error">
              {registerError}
            </span>
          )}
          {applyError && (
            <span className="text-xxsmall12 text-system-error">
              {applyError}
            </span>
          )}

          {coupons.length === 0 ? (
            <p className="py-2 text-xsmall14 text-neutral-45">
              적용 가능한 쿠폰이 없습니다. 쿠폰 코드를 등록한 뒤 사용해주세요.
            </p>
          ) : (
            <ul className="flex max-h-[200px] flex-col gap-2 overflow-y-auto">
              {coupons.map((coupon) => {
                const isSelected = coupon.couponId === selectedCouponId;
                return (
                  <li key={coupon.couponId}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      className={`flex w-full flex-col gap-0.5 rounded-xs border bg-neutral-100 p-3 text-left ${
                        isSelected ? 'border-primary' : 'border-neutral-85'
                      }`}
                      onClick={() => handleSelect(coupon)}
                    >
                      <span className="text-xsmall14 font-semibold">
                        {discountLabel(coupon)}
                      </span>
                      <span className="text-xsmall14">{coupon.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
