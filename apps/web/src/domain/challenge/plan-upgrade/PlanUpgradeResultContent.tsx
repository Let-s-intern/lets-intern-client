'use client';

import { mypageApplicationsQueryOptions } from '@/api/application';
import LoadingContainer from '@/common/loading/LoadingContainer';
import dayjs from '@/lib/dayjs';
import { ChallengePricePlanEnum } from '@/schema';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { z } from 'zod';
import { useConfirmPlanUpgradeMutation } from './api/planUpgrade';
import type { ConfirmPlanUpgradeRes } from './api/planUpgradeSchema';
import {
  FILLED_BUTTON_CLASS,
  OUTLINE_BUTTON_CLASS,
} from './constants/resultButtonClass';
import { useLoginRedirect } from './hooks/useLoginRedirect';
import { PlanUpgradeFailView } from './PlanUpgradeFailContent';
import { getPlanUpgradeServerError } from './utils/planUpgradeError';

/** 토스 성공 리다이렉트 쿼리. plan 은 결제 단계가 successUrl 에 붙인 대상 플랜이다 */
const resultSearchParamsSchema = z.object({
  paymentKey: z.string(),
  orderId: z.string(),
  amount: z.coerce.number(),
  plan: ChallengePricePlanEnum,
});

const CONFIRM_FAIL_TITLE = '업그레이드를 완료하지 못했어요';
const CONFIRM_ERROR_MESSAGE =
  '결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
const MYPAGE_HREF = '/mypage/application';

interface PlanUpgradeResultContentProps {
  applicationId: string;
}

type ConfirmOutcome =
  | { status: 'success'; result: ConfirmPlanUpgradeRes }
  | { status: 'error'; error: unknown };

/**
 * 토스 성공 리다이렉트를 받아 업그레이드를 승인한다 (설계안 D20, 셀프 업그레이드 절).
 *
 * 승인은 한 번만 부르고, 끝나면 쿼리에 `done=true` 를 붙인다. 뒤로가기·새로고침으로 다시
 * 들어오면 부르지 않는다. `app/(user)/order/result/page.tsx` 의 `postApplicationDone` 방식이다.
 */
const PlanUpgradeResultContent = ({
  applicationId,
}: PlanUpgradeResultContentProps) => {
  const isLoggedIn = useLoginRedirect();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRequested = useRef(false);
  // 승인 결과는 로컬 상태로 받는다. useMutation 의 data·error 는 옵저버에 묶여 있어
  // StrictMode 가 effect 를 다시 붙이면 진행 중인 승인의 결과가 화면에 오지 않는다.
  const [outcome, setOutcome] = useState<ConfirmOutcome | null>(null);

  const { mutateAsync } = useConfirmPlanUpgradeMutation(applicationId);
  // 챌린지명과 시작 여부는 마이페이지 카드와 같은 데이터로 본다
  const { data: applications } = useQuery({
    ...mypageApplicationsQueryOptions,
    enabled: isLoggedIn,
  });

  const params = useMemo(() => {
    const parsed = resultSearchParamsSchema.safeParse(
      Object.fromEntries(searchParams),
    );
    return parsed.success ? parsed.data : null;
  }, [searchParams]);
  const isDone = searchParams.get('done') === 'true';

  useEffect(() => {
    if (!isLoggedIn || !params || hasRequested.current) return;
    hasRequested.current = true;

    // 이미 승인을 부른 주소로 다시 들어왔다
    if (isDone) {
      router.replace(MYPAGE_HREF);
      return;
    }

    const { plan, paymentKey, orderId, amount } = params;
    mutateAsync({ toPlan: plan, paymentKey, orderId, amount })
      .then((response) => {
        setOutcome({ status: 'success', result: response });
        window.dataLayer?.push({
          event: 'plan_upgrade_success',
          program_id: response.programId,
          from_plan: response.fromPlan,
          to_plan: response.toPlan,
          payment_amount: response.additionalAmount,
          order_id: orderId,
        });
      })
      .catch((confirmError: unknown) => {
        setOutcome({ status: 'error', error: confirmError });
      })
      .finally(() => {
        const nextSearchParams = new URLSearchParams(searchParams.toString());
        nextSearchParams.set('done', 'true');
        router.replace(
          `${window.location.pathname}?${nextSearchParams.toString()}`,
        );
      });
  }, [isLoggedIn, params, isDone, mutateAsync, router, searchParams]);

  if (!isLoggedIn) {
    return <LoadingContainer />;
  }

  if (!params) {
    return (
      <PlanUpgradeFailView
        title={CONFIRM_FAIL_TITLE}
        message="잘못된 접근입니다."
        retryHref={`/plan-upgrade/${applicationId}`}
      />
    );
  }

  if (outcome?.status === 'error') {
    const { code, message } = getPlanUpgradeServerError(outcome.error);
    return (
      <PlanUpgradeFailView
        title={CONFIRM_FAIL_TITLE}
        message={message ?? CONFIRM_ERROR_MESSAGE}
        notice={
          code === 'PLAN_UPGRADE_SAVE_FAILED'
            ? '결제는 자동으로 취소됐어요'
            : undefined
        }
        retryHref={`/plan-upgrade/${applicationId}?plan=${params.plan}`}
      />
    );
  }

  if (!outcome) {
    return <LoadingContainer text="결제를 확인하고 있어요" />;
  }

  const { result } = outcome;
  const application = applications?.find(
    (item) => item.id === result.applicationId,
  );

  return (
    <PlanUpgradeSuccess
      result={result}
      challengeTitle={application?.programTitle}
      hasStarted={!!application?.programStartDate?.isBefore(dayjs())}
    />
  );
};

export default PlanUpgradeResultContent;

interface PlanUpgradeSuccessProps {
  result: ConfirmPlanUpgradeRes;
  challengeTitle?: string | null;
  /** 시작 전에는 대시보드가 열리지 않아 입장 버튼을 두지 않는다 */
  hasStarted: boolean;
}

const PlanUpgradeSuccess = ({
  result,
  challengeTitle,
  hasStarted,
}: PlanUpgradeSuccessProps) => (
  <div className="w-full px-5 py-10">
    <div className="mx-auto max-w-5xl">
      <h1 className="text-small20 text-neutral-0 flex w-full items-center justify-start py-6 font-bold">
        플랜 업그레이드 완료
      </h1>
      <div className="flex w-full flex-col gap-y-10 py-8">
        <div className="flex flex-col gap-2">
          {challengeTitle && (
            <p className="text-xsmall16 text-neutral-0 font-semibold">
              {challengeTitle}
            </p>
          )}
          <p className="text-xsmall16 text-neutral-20">
            {result.fromPlan} →{' '}
            <span className="text-primary font-semibold">{result.toPlan}</span>
          </p>
        </div>

        <div className="flex w-full flex-col justify-center gap-6">
          <div className="text-neutral-0 font-semibold">결제 상세</div>
          <div className="bg-neutral-90 flex w-full items-center justify-between gap-x-4 px-3 py-5">
            <div className="font-bold">추가 결제 금액</div>
            <div className="font-bold">
              {result.additionalAmount.toLocaleString()}원
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center">
            {result.paidAt && (
              <PaymentInfoRow
                title="결제 일시"
                content={dayjs(result.paidAt).format('M월 D일 HH:mm')}
              />
            )}
            {result.method && (
              <PaymentInfoRow title="결제 수단" content={result.method} />
            )}
            {result.receiptUrl && (
              <PaymentInfoRow title="영수증">
                <a
                  href={result.receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border-neutral-60 flex items-center justify-center rounded-sm border bg-white px-3 py-2 text-sm font-medium"
                >
                  영수증 보기
                </a>
              </PaymentInfoRow>
            )}
          </div>

          {hasStarted ? (
            <div className="flex w-full flex-col gap-3 md:flex-row">
              <Link href={MYPAGE_HREF} className={OUTLINE_BUTTON_CLASS}>
                마이페이지로
              </Link>
              <Link
                href={`/challenge/${result.applicationId}/${result.programId}`}
                className={FILLED_BUTTON_CLASS}
              >
                대시보드 입장
              </Link>
            </div>
          ) : (
            <Link href={MYPAGE_HREF} className={FILLED_BUTTON_CLASS}>
              마이페이지로
            </Link>
          )}
        </div>
      </div>
    </div>
  </div>
);

/** `domain/program/paymentSuccess/PaymentInfoRow.tsx` 와 같은 행 모양 */
const PaymentInfoRow = ({
  title,
  content,
  children,
}: {
  title: string;
  content?: string;
  children?: React.ReactNode;
}) => (
  <div className="flex w-full items-center justify-start gap-x-2 px-3 py-2">
    <div className="text-neutral-40">{title}</div>
    <div className="text-neutral-0 flex grow items-center justify-end">
      {children ?? content}
    </div>
  </div>
);
