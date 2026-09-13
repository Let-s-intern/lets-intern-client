'use client';

import { useUserQuery } from '@/api/user/user';
import BackHeader from '@/common/header/BackHeader';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { usePlanUpgradeQuery } from './api/planUpgrade';
import { useLoginRedirect } from './hooks/useLoginRedirect';

type TossPaymentsWidgets = ReturnType<
  Awaited<ReturnType<typeof loadTossPayments>>['widgets']
>;

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

const PAYMENT_ERROR_MESSAGE =
  '결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

/** 토스 orderName 최대 길이 */
const ORDER_NAME_MAX_LENGTH = 100;

interface PlanUpgradePaymentContentProps {
  applicationId: string;
}

/**
 * 플랜 업그레이드 결제 단계 (설계안 D17).
 *
 * `app/(user)/payment/page.tsx` 의 토스 결제위젯 흐름을 따른다. 금액은 쿼리를 믿지 않고
 * 조회 API 의 `additionalAmount` 를 쓴다. 서버가 승인 때 같은 값으로 다시 비교한다.
 */
const PlanUpgradePaymentContent = ({
  applicationId,
}: PlanUpgradePaymentContentProps) => {
  const isLoggedIn = useLoginRedirect();
  const router = useRouter();
  const planQuery = useSearchParams().get('plan');
  const { data: upgrade, isError } = usePlanUpgradeQuery(applicationId);
  const { data: user } = useUserQuery();

  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const tossInitialized = useRef(false);

  const option =
    upgrade && !upgrade.unavailableReason
      ? upgrade.options.find((item) => item.planType === planQuery)
      : undefined;
  const amount = option?.additionalAmount;
  const upgradeHref = `/plan-upgrade/${applicationId}`;

  // 고를 수 없는 플랜이거나 막힌 신청이면 업그레이드 화면이 사유와 상태를 보여준다
  const shouldReturn = isError || (!!upgrade && !option);

  useEffect(() => {
    if (isLoggedIn && shouldReturn) router.replace(upgradeHref);
  }, [isLoggedIn, shouldReturn, router, upgradeHref]);

  useEffect(() => {
    if (!user || amount === undefined || tossInitialized.current) return;
    tossInitialized.current = true;

    const init = async () => {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const created = tossPayments.widgets({
          customerKey: (user.id ?? '').slice(0, 16),
        });
        await created.setAmount({ currency: 'KRW', value: amount });
        await created.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'widgetA',
        });
        await created.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT',
        });
        setWidgets(created);
      } catch (error) {
        console.error(error);
        setErrorMessage(PAYMENT_ERROR_MESSAGE);
      }
    };

    init();
  }, [user, amount]);

  if (!isLoggedIn || !upgrade || !option) {
    return <LoadingContainer />;
  }

  const handlePayClick = async () => {
    if (!widgets) return;

    setIsRequesting(true);
    setErrorMessage(null);

    const planSearch = `plan=${option.planType}`;
    const orderName =
      `${upgrade.challengeTitle ?? ''} ${option.planType} 플랜 업그레이드`
        .trim()
        .slice(0, ORDER_NAME_MAX_LENGTH);

    try {
      await widgets.requestPayment({
        orderId: `plan-upgrade-${upgrade.applicationId}-${Date.now()}`,
        orderName,
        successUrl: `${window.location.origin}${upgradeHref}/result?${planSearch}`,
        failUrl: `${window.location.origin}${upgradeHref}/fail?${planSearch}`,
        customerEmail: user?.email || undefined,
        customerName: user?.name || undefined,
        customerMobilePhone:
          user?.phoneNum?.replace(/[^0-9]/g, '') || undefined,
      });
    } catch (error) {
      console.error(error);
      setErrorMessage(PAYMENT_ERROR_MESSAGE);
      setIsRequesting(false);
    }
  };

  const amountText = `${option.additionalAmount.toLocaleString()}원`;

  return (
    <div className="mx-auto w-full max-w-[55rem] pb-32 md:pb-6 md:pt-5">
      <BackHeader
        to={`${upgradeHref}?plan=${option.planType}`}
        className="mx-5"
      >
        결제하기
      </BackHeader>

      <section className="bg-neutral-95 mx-5 flex flex-col gap-1 rounded-md px-5 py-4">
        <p className="text-xsmall14 text-neutral-40">
          {upgrade.challengeTitle}
        </p>
        <p className="text-xsmall16 text-neutral-0 font-semibold">
          {upgrade.currentPlan.planType} → {option.planType}
        </p>
        <p className="text-xsmall14 text-neutral-20">
          추가 결제 금액 {amountText}
        </p>
      </section>

      <div id="payment-method" />
      <div id="agreement" />

      <div className="shadow-05 fixed bottom-0 left-0 right-0 rounded-t-lg bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3 md:static md:mx-5 md:rounded-none md:bg-transparent md:px-0 md:pb-0 md:pt-0 md:shadow-none">
        {errorMessage && (
          <p role="alert" className="text-xsmall14 text-primary mb-2">
            {errorMessage}
          </p>
        )}
        <button
          type="button"
          className="border-primary bg-primary disabled:border-neutral-70 disabled:bg-neutral-70 flex w-full items-center justify-center rounded-md border-2 px-6 py-3 text-lg font-medium text-neutral-100 transition hover:opacity-90"
          disabled={!widgets || isRequesting}
          onClick={handlePayClick}
        >
          {amountText} 결제하기
        </button>
      </div>
    </div>
  );
};

export default PlanUpgradePaymentContent;
