'use client';

import { ChallengePricePlanEnum } from '@/schema';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import {
  FILLED_BUTTON_CLASS,
  OUTLINE_BUTTON_CLASS,
} from './constants/resultButtonClass';

/**
 * 토스 실패 리다이렉트 쿼리.
 * `data/getPaymentSearchParams.ts` 의 `paymentFailSearchParamsSchema` 필드에 결제 단계가 붙인 plan 을 더했다.
 */
const failSearchParamsSchema = z.object({
  orderId: z.string(),
  code: z.string(),
  message: z.string(),
  plan: ChallengePricePlanEnum,
});

/** 사용자가 결제창을 닫았을 때 토스가 주는 코드 */
const PAY_PROCESS_CANCELED = 'PAY_PROCESS_CANCELED';

interface PlanUpgradeFailViewProps {
  title: string;
  message: string;
  /** 문구 아래 `text-primary` 로 한 줄 더 보일 안내 */
  notice?: string;
  retryHref: string;
}

/** 결제 실패와 승인 실패가 함께 쓰는 실패 화면. `app/(user)/order/fail/page.tsx` 틀이다 */
export const PlanUpgradeFailView = ({
  title,
  message,
  notice,
  retryHref,
}: PlanUpgradeFailViewProps) => (
  <div className="mx-auto max-w-5xl px-5 py-10">
    <div className="flex min-h-52 w-full flex-col items-center justify-center gap-2 rounded-md bg-neutral-100 py-6 text-center">
      <h1 className="text-small20 text-primary font-semibold">{title}</h1>
      <p className="text-xsmall16 text-neutral-20">{message}</p>
      {notice && <p className="text-xsmall16 text-primary">{notice}</p>}
    </div>
    <div className="flex w-full flex-col gap-3">
      <Link href={retryHref} className={FILLED_BUTTON_CLASS}>
        다시 시도하기
      </Link>
      <Link href="/mypage/application" className={OUTLINE_BUTTON_CLASS}>
        마이페이지로
      </Link>
    </div>
  </div>
);

interface PlanUpgradeFailContentProps {
  applicationId: string;
}

const PlanUpgradeFailContent = ({
  applicationId,
}: PlanUpgradeFailContentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const parsed = failSearchParamsSchema.safeParse(
      Object.fromEntries(searchParams),
    );
    return parsed.success ? parsed.data : null;
  }, [searchParams]);

  // 고른 플랜을 유지한 채 업그레이드 화면으로 돌아간다
  const retryHref = params
    ? `/plan-upgrade/${applicationId}?plan=${params.plan}`
    : `/plan-upgrade/${applicationId}`;
  const isCanceled = params?.code === PAY_PROCESS_CANCELED;

  useEffect(() => {
    if (isCanceled) router.replace(retryHref);
  }, [isCanceled, retryHref, router]);

  // 결제창을 닫은 것은 실패가 아니라 실패 화면 없이 돌려보낸다
  if (isCanceled) return null;

  return (
    <PlanUpgradeFailView
      title="결제에 실패했어요"
      message={params?.message ?? '잘못된 접근입니다.'}
      retryHref={retryHref}
    />
  );
};

export default PlanUpgradeFailContent;
