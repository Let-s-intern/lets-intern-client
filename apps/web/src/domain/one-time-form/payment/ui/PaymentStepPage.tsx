'use client';

import {
  getOneTimeFormErrorCode,
  ONE_TIME_FORM_ALREADY_APPLIED,
  ONE_TIME_FORM_NOT_FOUND,
  useCreateOneTimeFormApplicationMutation,
  useOneTimeFormQuery,
} from '@/api/one-time-form/oneTimeForm';
import { useUserQuery } from '@/api/user/user';
import { generateOrderId } from '@/lib/order';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import FormPopupShell from '../../ui/FormPopupShell';
import ApplyPeriodState from '../../ui/states/ApplyPeriodState';
import LoadErrorState from '../../ui/states/LoadErrorState';
import NotFoundState from '../../ui/states/NotFoundState';
import {
  clearApplicationSession,
  saveDraft,
} from '../../utils/applicationDraft';
import {
  buildLoginPath,
  isLoginRequiredError,
} from '../../utils/loginRequired';
import { readUtm } from '../../utils/utmStorage';
import useStoredDraft from '../hooks/useStoredDraft';
import { getApplicationErrorMessage } from '../utils/applicationErrorMessage';
import { buildCreateApplicationRequest } from '../utils/buildCreateApplicationRequest';
import { buildPaymentAmountSummary, formatWon } from '../utils/paymentAmount';
import { buildTossPaymentRequest } from '../utils/tossPaymentRequest';
import ApplicantSummaryCard from './ApplicantSummaryCard';
import PaymentAmountCard from './PaymentAmountCard';
import PaymentCard from './PaymentCard';
import PaymentConsents, {
  isAllConsented,
  NO_PAYMENT_CONSENTS,
} from './PaymentConsents';
import TossPaymentMethods, {
  type TossPaymentsWidgets,
} from './TossPaymentMethods';

const PAYMENT_STEP = { current: 2, total: 2 };
const STORAGE_ERROR_MESSAGE =
  '브라우저 저장소를 쓸 수 없어 결제를 진행할 수 없어요. 시크릿 모드를 끄고 다시 시도해 주세요.';
const TOSS_REQUEST_ERROR_MESSAGE =
  '결제를 시작하지 못했어요. 잠시 후 다시 시도해 주세요.';

const LoadingState = () => (
  <FormPopupShell title="결제하기" step={PAYMENT_STEP}>
    <p className="text-xsmall14 text-neutral-40 py-10 text-center">
      불러오는 중이에요
    </p>
  </FormPopupShell>
);

interface PaymentStepPageProps {
  slug: string;
  /** 토스 failUrl 로 돌아왔을 때 쿼리의 message. 없으면 null */
  tossFailureMessage: string | null;
}

/**
 * 유료 폼 결제 단계(2/2). 정보 입력에서 보관한 값으로 그린다(계약 11.2·11.3).
 * 합계가 0원이면 토스 위젯 대신 안내를 두고 "0원 신청하기"로 바로 U3 를 부른다(계약 7절).
 * 보관값이 없으면(직접 진입, 이미 신청 완료 후 새로고침) 정보 입력으로 돌려보낸다.
 */
const PaymentStepPage = ({
  slug,
  tossFailureMessage,
}: PaymentStepPageProps) => {
  const router = useRouter();
  const draft = useStoredDraft(slug);
  const formQuery = useOneTimeFormQuery(slug);
  const { data: user } = useUserQuery();
  const createApplication = useCreateOneTimeFormApplicationMutation(slug);

  const [consents, setConsents] = useState(NO_PAYMENT_CONSENTS);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isRequestingToss, setIsRequestingToss] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formHref = `/form/${slug}`;
  const shouldReturnToForm =
    draft === null || formQuery.data?.form.isPaid === false;

  useEffect(() => {
    if (shouldReturnToForm) router.replace(formHref);
  }, [shouldReturnToForm, router, formHref]);

  if (draft === undefined || shouldReturnToForm || formQuery.isLoading) {
    return <LoadingState />;
  }

  const { data } = formQuery;
  if (!data) {
    return getOneTimeFormErrorCode(formQuery.error) ===
      ONE_TIME_FORM_NOT_FOUND ? (
      <NotFoundState />
    ) : (
      <LoadErrorState onRetry={() => formQuery.refetch()} />
    );
  }
  if (data.form.applyStatus !== 'OPEN') {
    return <ApplyPeriodState form={data.form} />;
  }

  // 금액은 보관값이 아니라 지금의 폼 설정으로 다시 계산한다. 서버도 같은 값으로 대조한다
  const summary = buildPaymentAmountSummary(data, draft.selectedOptionIds);
  const amount = summary.totalPrice;
  const isZeroAmount = amount === 0;
  const goToForm = () => router.push(formHref);
  const goToComplete = () => router.replace(`/form/${slug}/complete`);

  const applyWithoutPayment = (orderId: string) => {
    const request = buildCreateApplicationRequest(
      { ...draft, orderId, amount },
      readUtm(slug),
      { paymentKey: null, orderId, amount: 0 },
    );
    createApplication.mutate(request, {
      onSuccess: () => {
        clearApplicationSession(slug);
        goToComplete();
      },
      onError: (error) => {
        if (getOneTimeFormErrorCode(error) === ONE_TIME_FORM_ALREADY_APPLIED) {
          goToComplete();
          return;
        }
        // 보관값은 그대로 두어 로그인 뒤 이 결제 단계에서 이어 신청한다
        if (isLoginRequiredError(error)) {
          router.push(buildLoginPath(`/form/${slug}/payment`));
          return;
        }
        setErrorMessage(getApplicationErrorMessage(error));
      },
    });
  };

  const requestTossPayment = async (orderId: string) => {
    if (!widgets) return;
    setIsRequestingToss(true);
    try {
      await widgets.requestPayment(
        buildTossPaymentRequest({
          origin: window.location.origin,
          slug,
          form: data.form,
          draft,
          orderId,
        }),
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(TOSS_REQUEST_ERROR_MESSAGE);
      setIsRequestingToss(false);
    }
  };

  const handlePayClick = () => {
    setErrorMessage(null);
    // 계약 11.3: 결제를 시도할 때마다 새 주문번호를 만들어 보관값에 넣는다. 결과 처리가 이 값을 쓴다
    const orderId = generateOrderId();
    if (!saveDraft(slug, { ...draft, orderId, amount })) {
      setErrorMessage(STORAGE_ERROR_MESSAGE);
      return;
    }
    if (isZeroAmount) {
      applyWithoutPayment(orderId);
    } else {
      requestTossPayment(orderId);
    }
  };

  const isPayDisabled =
    !isAllConsented(consents) ||
    createApplication.isPending ||
    (!isZeroAmount && (!widgets || isRequestingToss));

  return (
    <FormPopupShell
      title="결제하기"
      step={PAYMENT_STEP}
      onBack={goToForm}
      footer={
        <>
          {errorMessage ? (
            <p
              role="alert"
              className="text-xxsmall12 text-requirement mb-2.5 break-keep text-center"
            >
              {errorMessage}
            </p>
          ) : null}
          <button
            type="button"
            disabled={isPayDisabled}
            onClick={handlePayClick}
            className="bg-primary text-xsmall16 text-static-100 hover:bg-primary-hover disabled:bg-neutral-85 disabled:text-neutral-45 h-[52px] w-full rounded-sm font-semibold transition-colors"
          >
            {isZeroAmount ? '0원 신청하기' : `${formatWon(amount)} 결제하기`}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {tossFailureMessage !== null ? (
          <div
            role="alert"
            className="bg-neutral-95 text-xsmall14 text-neutral-20 rounded-md p-4"
          >
            <b className="block font-semibold">결제가 완료되지 않았어요</b>
            {tossFailureMessage ? (
              <p className="mt-1">{tossFailureMessage}</p>
            ) : null}
            <p className="text-neutral-40 mt-1">
              결제 수단을 확인하고 다시 결제해 주세요.
            </p>
          </div>
        ) : null}
        <ApplicantSummaryCard applicant={draft} onEdit={goToForm} />
        <PaymentAmountCard summary={summary} />
        <PaymentCard title="결제 수단">
          {isZeroAmount ? (
            <p className="bg-neutral-95 text-xsmall14 text-neutral-35 rounded-sm p-4">
              결제할 금액이 0원이라 결제 수단을 고르지 않아요. 아래 &quot;0원
              신청하기&quot;를 누르면 바로 신청돼요.
            </p>
          ) : user ? (
            <TossPaymentMethods
              amount={amount}
              customerKey={(user.id ?? '').slice(0, 16)}
              onReady={setWidgets}
            />
          ) : null}
        </PaymentCard>
        <PaymentConsents value={consents} onChange={setConsents} />
      </div>
    </FormPopupShell>
  );
};

export default PaymentStepPage;
