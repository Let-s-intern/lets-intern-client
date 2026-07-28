'use client';

import BaseModal from '@/common/modal/BaseModal';
import { useState } from 'react';
import { useRegisterCoupon } from '../hooks/useRegisterCoupon';

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
            <p className="text-neutral-0 text-small18 font-semibold">
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
                className="bg-neutral-95 text-xsmall16 placeholder:text-neutral-45 rounded-md p-3 outline-none"
              />
              {errorMessage && (
                <span className="text-xxsmall12 mt-1 text-red-500">
                  {errorMessage}
                </span>
              )}
            </div>
            <ul className="text-xsmall14 text-neutral-45 flex flex-col gap-1">
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
        <div className="border-neutral-85 flex gap-3 border-t px-5 py-4">
          <button
            className="border-neutral-80 rounded-xs flex-1 border py-3 font-medium text-neutral-50"
            onClick={handleClose}
          >
            닫기
          </button>
          <button
            className="rounded-xs bg-primary disabled:bg-neutral-85 flex-1 py-3 font-medium text-white disabled:cursor-not-allowed disabled:text-neutral-50"
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
