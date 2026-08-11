'use client';

import { CouponItem, useMyCoupons } from '@/api/coupon/coupon';
import CloseIcon from '@/assets/icons/close.svg?react';
import { ICouponForm } from '@/types/interface';
import { useState } from 'react';
import { useApplyCoupon } from '../hooks/useApplyCoupon';
import CouponSelectModal from '../modal/CouponSelectModal';

export interface CouponSectionProps {
  setCoupon: (
    coupon: ((prevCoupon: ICouponForm) => ICouponForm) | ICouponForm,
  ) => void;
  maxAmount?: number;
  programType: string;
}

const CouponSection = ({
  setCoupon,
  programType,
  maxAmount = Infinity,
}: CouponSectionProps) => {
  const { data: coupons = [] } = useMyCoupons(programType);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { applyCoupon, applyError } = useApplyCoupon({
    programType,
    maxAmount,
    setCoupon: (coupon) => setCoupon(coupon),
  });

  const availableCount = coupons.length;
  const isEmpty = availableCount === 0;

  const handleApply = (coupon: CouponItem | null) => {
    setSelectedCoupon(coupon);
    if (!coupon) {
      setCoupon({ id: null, price: 0 });
      return;
    }
    applyCoupon(coupon.code);
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-95 flex flex-1 items-center justify-between rounded-md p-3">
            <span className="text-xsmall14 md:text-xsmall16 font-normal">
              {selectedCoupon ? (
                <span className="font-medium">{selectedCoupon.name}</span>
              ) : isEmpty ? (
                <div>
                  <span className="text-neutral-45 hidden md:inline">
                    해당 프로그램에 적용 가능한 쿠폰이 없습니다.{' '}
                  </span>
                  <span className="text-neutral-45">
                    <button
                      className="text-primary underline"
                      onClick={() => setIsModalOpen(true)}
                    >
                      쿠폰 등록
                    </button>{' '}
                    후 사용해주세요.
                  </span>
                </div>
              ) : (
                <>
                  적용 가능한 쿠폰이{' '}
                  <span className="text-primary">{availableCount}장</span>
                  있습니다.
                </>
              )}
            </span>
            {selectedCoupon && (
              <button
                className="text-neutral-45"
                onClick={() => {
                  setSelectedCoupon(null);
                  setCoupon({ id: null, price: 0 });
                }}
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            className="bg-primary text-xsmall16 rounded-sm px-5 py-[9px] text-neutral-100"
            onClick={() => setIsModalOpen(true)}
          >
            {isEmpty ? '쿠폰 등록' : '쿠폰 적용'}
          </button>
        </div>
        {applyError && (
          <span className="text-xxsmall12 text-system-error">{applyError}</span>
        )}
      </div>
      <CouponSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
        currentCouponId={selectedCoupon?.couponId ?? null}
        coupons={coupons}
        maxAmount={maxAmount}
      />
    </>
  );
};

export default CouponSection;
