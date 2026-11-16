'use client';

import BaseModal from '@/common/modal/BaseModal';
import { useState } from 'react';
import { useRegisterCoupon } from '@/api/coupon/coupon';

interface CouponRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CouponRegisterModal = ({ isOpen, onClose }: CouponRegisterModalProps) => {
  const [code, setCode] = useState('');

  const handleClose = () => {
    setCode('');
    clearError();
    onClose();
  };

  const { register, isPending, errorMessage, clearError } =
    useRegisterCoupon(handleClose);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      className="mx-4 max-w-[560px]"
    >
      <div className="flex flex-col">
        <div className="flex flex-col gap-8 px-5 pb-6 pt-6">
          <div className="flex items-center justify-between">
            <p className="text-small18 font-semibold text-neutral-0">
              쿠폰 등록
            </p>
            <button onClick={handleClose}>
              <img
                src="/icons/menu_close_md.svg"
                alt="close"
                className="h-6 w-6"
              />
            </button>
          </div>
          <div className="flex flex-col gap-[60px]">
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  clearError();
                }}
                placeholder="쿠폰 코드를 입력해주세요."
                className="rounded-md bg-neutral-95 p-3 text-xsmall16 outline-none placeholder:text-neutral-45"
              />
              {errorMessage && (
                <span className="mt-1 text-xxsmall12 text-red-500">
                  {errorMessage}
                </span>
              )}
            </div>
            <ul className="flex flex-col gap-1 text-xsmall14 text-neutral-45">
              <li className="flex gap-2">
                <span>•</span>
                <span>유효기간이 지난 쿠폰은 등록할 수 없습니다.</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  쿠폰 등록 내역은 &apos;마이페이지 → 쿠폰함&apos;에서 확인할 수
                  있습니다.
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex gap-3 border-t border-neutral-85 px-5 py-4">
          <button
            className="flex-1 rounded-xs border border-neutral-80 py-3 font-medium text-neutral-50"
            onClick={handleClose}
          >
            닫기
          </button>
          <button
            className="flex-1 rounded-xs bg-primary py-3 font-medium text-white disabled:cursor-not-allowed disabled:bg-neutral-85 disabled:text-neutral-50"
            disabled={!code.trim() || isPending}
            onClick={() => register(code)}
          >
            등록하기
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CouponRegisterModal;
