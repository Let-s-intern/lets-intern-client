import PriceView from '@/common/price/PriceView';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

function PassMemberPrice({ price }: { price: number }) {
  return (
    <div className="flex shrink-0 flex-col items-end gap-0.5">
      <span className="bg-primary-10 text-primary rounded-xxs p-1 text-[11px] font-medium leading-none">
        패스 회원가
      </span>
      <span className="text-primary text-xsmall14 font-bold">
        {price.toLocaleString()}원
      </span>
    </div>
  );
}

/**
 * 플랜 가격 — 권한 유저는 패스회원가만, 일반 유저는 기존 가격(+패스회원가 뱃지).
 * passPrice undefined면 패스 혜택 제외(LIGHT) → 항상 기존 가격.
 */
export function PlanPriceRight({
  regularPrice,
  discountAmount,
  passPrice,
  hasPrivilege,
  showPassPrice,
}: {
  regularPrice: number;
  discountAmount: number;
  passPrice?: number;
  hasPrivilege: boolean;
  showPassPrice: boolean;
}) {
  if (hasPrivilege && passPrice !== undefined) {
    return <PassMemberPrice price={passPrice} />;
  }
  return (
    <div className="flex flex-col items-end gap-2 md:flex-row md:gap-10">
      <PriceView price={regularPrice} discount={discountAmount} />
      {showPassPrice && passPrice !== undefined && (
        <PassMemberPrice price={passPrice} />
      )}
    </div>
  );
}

/** 바텀시트 하단 안내 — 권한 유저: 정보 / 비보유자(열린 패스에 CHALLENGE): 업셀 */
export function MembershipBenefitNotice({
  show,
  hasPrivilege,
  passHref,
}: {
  show: boolean;
  hasPrivilege: boolean;
  passHref: string | null;
}) {
  if (!show) return null;

  const containerClass =
    'bg-primary-5 rounded-xs mt-4 flex items-center justify-between gap-2 px-4 py-3';

  if (hasPrivilege) {
    return (
      <div className={containerClass}>
        <p className="text-xxsmall12 md:text-xsmall14 flex w-full items-center justify-between gap-2">
          <span className="text-primary hidden shrink-0 font-bold md:inline">
            올인원 패스 회원
          </span>
          <span className="text-neutral-30">
            베이직 플랜 0원, 플랜 업그레이드 시 차액만 결제
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <p className="text-xxsmall12 md:text-xsmall14 flex min-w-0 items-center gap-2">
        <span className="text-neutral-10 md:hidden">
          올인원 패스 회원은 베이직 0원
        </span>
        <span className="text-neutral-30 hidden shrink-0 md:inline">
          챌린지 2개 이상 참여한다면, 패스가 더 유리해요!
        </span>
        <span
          aria-hidden
          className="bg-neutral-60 hidden h-[22px] w-px shrink-0 md:inline-block"
        />
        <span className="text-neutral-30 hidden md:inline">
          베이직 플랜 0원, 플랜 업그레이드 시 차액만 결제
        </span>
      </p>
      {passHref && (
        <Link
          href={passHref}
          className="text-primary text-xxsmall12 md:text-xsmall14 flex shrink-0 items-center gap-0.5 font-semibold"
        >
          <span className="flex items-center gap-1 md:hidden">
            알아보기{' '}
            <ChevronRight
              size={12}
              strokeWidth={3.5}
              className="text-primary"
            />
          </span>
          <span className="hidden md:flex md:items-center md:gap-3">
            올인원패스 알아보기{' '}
            <ChevronRight
              size={20}
              strokeWidth={2.5}
              className="text-primary"
            />
          </span>
        </Link>
      )}
    </div>
  );
}
