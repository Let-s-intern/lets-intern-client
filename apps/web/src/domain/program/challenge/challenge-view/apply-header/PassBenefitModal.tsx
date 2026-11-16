'use client';

import { useGetAllInOnePassLanding } from '@/domain/all-in-one-pass/api/landing';
import { usePassPricing } from '@/domain/all-in-one-pass/landing/usePassPricing';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getMonthlyPrice } from './PassPromoStrip';

interface Props {
  passHref: string;
  /** 열린 패스가 하나일 때만 가격·구성을 보인다 */
  membershipId: number | null;
  /** 지금 보고 있는 챌린지(또는 가이드북)의 결제 금액 */
  programPrice: number;
  /** 패스 회원이 이 프로그램을 신청할 때 내는 금액 */
  passProgramPrice: number;
  onClose: () => void;
}

/** 가격 카드의 "올인원 패스 구독하고 참여하기" 를 누르면 뜨는 안내 모달 (LC-3633) */
function PassBenefitModal({
  passHref,
  membershipId,
  programPrice,
  passProgramPrice,
  onClose,
}: Props) {
  const { data: landing } = useGetAllInOnePassLanding(membershipId ?? -1);
  const { passPrice, contentRows } = usePassPricing(landing?.plans ?? []);
  const monthlyPrice = landing
    ? getMonthlyPrice(passPrice, landing.periodDays)
    : null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pass-benefit-title"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[480px] flex-col overflow-y-auto rounded-[20px] bg-white p-5 md:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="w-fit rounded-xxs bg-primary px-2 py-1 text-xxsmall12 font-semibold text-white">
            ALL-IN-ONE PASS
          </span>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="text-neutral-40"
          >
            <X size={22} />
          </button>
        </div>

        <h2
          id="pass-benefit-title"
          className="mt-3 text-small20 font-bold text-neutral-0 md:text-medium22"
        >
          올인원 패스로 이 프로그램을
          <br />
          {passProgramPrice === 0
            ? '0원에 참여할 수 있어요'
            : `${passProgramPrice.toLocaleString()}원에 참여할 수 있어요`}
        </h2>

        <div className="mt-4 flex items-center justify-between rounded-md bg-primary-5 px-4 py-3">
          <span className="text-xsmall14 text-neutral-30">이 프로그램</span>
          <span className="flex items-center gap-2">
            <span className="text-xsmall14 text-neutral-40 line-through">
              {programPrice.toLocaleString()}원
            </span>
            <strong className="text-small18 font-bold text-primary">
              {passProgramPrice.toLocaleString()}원
            </strong>
          </span>
        </div>

        {landing && (
          <div className="mt-5 flex flex-col gap-1">
            <span className="text-xsmall14 text-neutral-30">패스 가격</span>
            <span className="flex items-baseline gap-2">
              <strong className="text-medium24 font-bold text-neutral-0">
                {passPrice.toLocaleString()}원
              </strong>
              {monthlyPrice !== null && (
                <span className="text-xsmall14 font-semibold text-primary">
                  월 {monthlyPrice.toLocaleString()}원
                </span>
              )}
            </span>
          </div>
        )}

        {contentRows.length > 0 && (
          <ul className="mt-5 flex flex-col gap-3 border-t border-neutral-85 pt-5">
            {contentRows.map((row) => (
              <li key={row.label} className="flex flex-col gap-0.5">
                <span className="text-xsmall16 font-semibold text-neutral-0">
                  {row.label}
                </span>
                {row.note && (
                  <span className="text-xsmall14 text-neutral-40">
                    {row.note}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href={passHref}
            className="pass_benefit_modal_cta flex w-full justify-center rounded-md bg-primary px-6 py-3 text-xsmall16 font-semibold text-white"
          >
            패스 자세히 보기
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md border border-neutral-80 px-6 py-3 text-xsmall16 font-medium text-neutral-30"
          >
            닫기
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default PassBenefitModal;
