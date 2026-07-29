'use client';

import { COUPON_TYPE_LABEL, CouponItem, useRegisterCoupon } from '@/api/coupon/coupon';
import OutlinedButton from '@/common/button/OutlinedButton';
import SolidButton from '@/common/button/SolidButton';
import BaseModal from '@/common/modal/BaseModal';
import dayjs from '@/lib/dayjs';
import { useEffect, useRef, useState } from 'react';

interface CouponSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (coupon: CouponItem | null) => void;
  currentCouponId: number | null;
  coupons: CouponItem[];
  maxAmount?: number;
}

const formatDate = (dateStr: string) =>
  dayjs(dateStr).format('YYYY년 MM월 DD일');

const getDiscountValue = (discount: number) =>
  discount === -1 ? Infinity : discount;

const CouponSelectModal = ({
  isOpen,
  onClose,
  onApply,
  currentCouponId,
  coupons,
  maxAmount = Infinity,
}: CouponSelectModalProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(currentCouponId);
  const [registerCode, setRegisterCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    isPending: isRegistering,
    errorMessage: registerError,
    clearError,
  } = useRegisterCoupon(
    () => {
      setRegisterCode('');
      setSuccessMessage('쿠폰이 등록되었습니다.');
      setTimeout(() => setSuccessMessage(''), 2000);
    },
  );

  const handleClose = () => {
    setRegisterCode('');
    setSuccessMessage('');
    clearError();
    onClose();
  };

  const sortedCoupons = [...coupons].sort((a, b) => {
    const discountDiff =
      getDiscountValue(b.discount) - getDiscountValue(a.discount);
    if (discountDiff !== 0) return discountDiff;
    return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedId(currentCouponId);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen, currentCouponId]);

  const selectedCoupon =
    sortedCoupons.find((c) => c.couponId === selectedId) ?? null;

  const discountAmount = selectedCoupon
    ? selectedCoupon.discount === -1
      ? maxAmount === Infinity
        ? null
        : maxAmount
      : Math.min(selectedCoupon.discount, maxAmount)
    : 0;

  const handleApply = () => {
    onApply(selectedCoupon);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      className="mx-4 max-w-[560px]"
    >
      <div className="flex flex-col">
        {/* 헤더 */}
        <div className="border-neutral-85 flex items-center justify-between border-b px-5 py-4">
          <span className="text-xsmall16 text-neutral-0 font-semibold">
            쿠폰
          </span>
          <button onClick={handleClose}>
            <img
              src="/icons/menu_close_md.svg"
              alt="close"
              className="h-6 w-6"
            />
          </button>
        </div>

        {/* 쿠폰 코드 등록 */}
        <div>
          <div className="px-5 py-4">
            <span>쿠폰 등록</span>
          </div>
          <div className="flex flex-col gap-1 px-5 pb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={registerCode}
                onChange={(e) => {
                  setRegisterCode(e.target.value);
                  clearError();
                }}
                ref={inputRef}
                placeholder="쿠폰 코드를 입력해주세요."
                className="bg-neutral-95 text-xsmall16 placeholder:text-neutral-45 flex-1 rounded-md p-3 outline-none"
              />
              <SolidButton
                size="md"
                disabled={!registerCode.trim() || isRegistering}
                onClick={() => register(registerCode)}
              >
                등록하기
              </SolidButton>
            </div>
            {registerError && (
              <span className="text-xxsmall12 text-system-error">
                {registerError}
              </span>
            )}
            {successMessage && (
              <span className="text-xxsmall12 text-system-positive-blue">
                {successMessage}
              </span>
            )}
          </div>
        </div>

        {/* 적용 가능 장수 */}
        <div className="flex items-center justify-between px-5 py-4">
          <span>쿠폰 적용</span>
          <span>
            적용 가능{' '}
            <span className="text-primary font-semibold">
              {sortedCoupons.length}장
            </span>
          </span>
        </div>

        {/* 쿠폰 목록 */}
        <div className="flex max-h-[250px] flex-col gap-3 overflow-y-auto px-5 pb-4 md:max-h-[300px]">
          {sortedCoupons.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-xsmall14 text-neutral-40">
                보유 쿠폰이 없습니다.
              </p>
            </div>
          ) : (
            sortedCoupons.map((coupon, index) => {
              const isSelected = selectedId === coupon.couponId;
              const isBest = index === 0;

              return (
                <button
                  key={coupon.couponId}
                  className={`rounded-xs flex w-full items-start gap-3 border p-4 text-left transition-colors ${
                    isSelected ? 'border-primary' : 'border-neutral-85'
                  }`}
                  onClick={() =>
                    setSelectedId(isSelected ? null : coupon.couponId)
                  }
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                      isSelected ? 'bg-primary' : 'border-neutral-70 border-2'
                    }`}
                  >
                    {isSelected && (
                      <div className="h-2.5 w-2.5 rounded-full bg-neutral-100" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xxsmall12 text-neutral-40">
                        {COUPON_TYPE_LABEL[coupon.couponType]}
                      </span>
                      {isBest && (
                        <span className="bg-primary-10 text-primary text-xxsmall12 rounded rounded-[3px] px-2 py-1">
                          최대 할인
                        </span>
                      )}
                    </div>
                    <p className="text-xsmall16 md:text-small18 font-bold">
                      {coupon.discount === -1
                        ? '전액 할인'
                        : `${coupon.discount.toLocaleString()}원`}
                    </p>
                    <p className="text-xsmall16 font-semibold">{coupon.name}</p>
                    <p className="md:text-xsmall14 text-neutral-30 text-xxsmall12 tracking-tighter md:tracking-tight">
                      유효기간 : {formatDate(coupon.startDate)} ~{' '}
                      {formatDate(coupon.endDate)}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* 할인 금액 */}
        <div className="border-neutral-85 flex items-center justify-between border-b px-6 py-4">
          <span>할인 금액</span>
          <span>
            {discountAmount === null
              ? '전액 할인'
              : `-${(discountAmount as number).toLocaleString()}원`}
          </span>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 px-5 py-4">
          <OutlinedButton
            variant="secondary"
            className="text-neutral-40 flex-1"
            onClick={handleClose}
          >
            닫기
          </OutlinedButton>
          <SolidButton className="flex-1" onClick={handleApply}>
            쿠폰 적용하기
          </SolidButton>
        </div>
      </div>
    </BaseModal>
  );
};

export default CouponSelectModal;
