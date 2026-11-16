'use client';

import { useGetAllInOnePassLanding } from '@/domain/all-in-one-pass/api/landing';
import { usePassPricing } from '@/domain/all-in-one-pass/landing/usePassPricing';
import Link from 'next/link';

/** 패스 기간을 30일 단위 개월 수로 바꿔 월 금액을 낸다. 기간이 없으면 null */
const getMonthlyPrice = (passPrice: number, periodDays: number | null) => {
  if (!periodDays || passPrice <= 0) return null;
  const months = Math.max(1, Math.round(periodDays / 30));
  return Math.round(passPrice / months);
};

interface Props {
  passHref: string;
  /** 열린 패스가 하나일 때만 가격을 보인다 */
  membershipId: number | null;
}

function PassPromoStrip({ passHref, membershipId }: Props) {
  const { data: landing } = useGetAllInOnePassLanding(membershipId ?? -1);
  const { passPrice } = usePassPricing(landing?.plans ?? []);
  const monthlyPrice = landing
    ? getMonthlyPrice(passPrice, landing.periodDays)
    : null;

  return (
    <Link
      href={passHref}
      className="flex flex-col gap-2 rounded-sm border border-primary-20 bg-primary-5 px-4 py-3 md:flex-row md:items-center md:gap-4 md:px-6 md:py-4"
    >
      <span className="w-fit shrink-0 rounded-xxs bg-primary px-2 py-1 text-xxsmall12 font-semibold text-white md:text-xsmall14">
        ALL-IN-ONE PASS
      </span>
      <span className="flex-1 text-xsmall14 text-neutral-0 md:text-xsmall16">
        <strong className="font-bold">올인원 패스</strong>면 이 챌린지 포함
        이력서 · 자소서 · 포트폴리오 챌린지, VOD, 1:1 멘토링까지
        {monthlyPrice !== null && (
          <strong className="font-bold text-primary">
            {' '}
            월 ₩{monthlyPrice.toLocaleString()}
          </strong>
        )}
      </span>
      <span className="shrink-0 text-xsmall14 font-semibold text-primary md:text-xsmall16">
        패스 자세히 보기 →
      </span>
    </Link>
  );
}

export default PassPromoStrip;
