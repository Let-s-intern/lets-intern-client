'use client';

import {
  getOneTimeFormErrorCode,
  ONE_TIME_FORM_NOT_FOUND,
  useMyOneTimeFormApplicationQuery,
  useOneTimeFormQuery,
} from '@/api/one-time-form/oneTimeForm';
import useAuthStore from '@/store/useAuthStore';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import FormPopupShell from '../../ui/FormPopupShell';
import LoadErrorState from '../../ui/states/LoadErrorState';
import NotFoundState from '../../ui/states/NotFoundState';
import {
  lineButtonClass,
  primaryButtonClass,
} from '../../ui/states/StateScreen';
import { formatMonthDayWithWeekday } from '../utils/cancelDeadlineText';
import { closeWindowOrGoHome } from '../utils/closeWindowOrGoHome';

interface CompletePageProps {
  slug: string;
}

const LoadingState = () => (
  <FormPopupShell title="신청 완료">
    <p className="text-xsmall14 text-neutral-40 py-10 text-center">
      불러오는 중이에요
    </p>
  </FormPopupShell>
);

/**
 * 신청 완료 화면(계약 11.1, 시안 2절 완료). U1 의 안내 문구와 U2 의 내 신청으로 그린다.
 * 비로그인이거나 유효한 신청이 없으면 신청 페이지로 replace 한다.
 */
const CompletePage = ({ slug }: CompletePageProps) => {
  const router = useRouter();
  const formQuery = useOneTimeFormQuery(slug);
  const isAuthInitialized = useAuthStore((s) => s.isInitialized);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const myApplicationQuery = useMyOneTimeFormApplicationQuery(slug, {
    enabled: isLoggedIn,
  });
  const application = myApplicationQuery.data;

  const hasNoApplication =
    myApplicationQuery.isSuccess && (!application || application.isCanceled);
  const shouldLeave = (isAuthInitialized && !isLoggedIn) || hasNoApplication;

  useEffect(() => {
    if (shouldLeave) router.replace(`/form/${slug}`);
  }, [shouldLeave, router, slug]);

  if (formQuery.isLoading) return <LoadingState />;
  if (!formQuery.data) {
    return getOneTimeFormErrorCode(formQuery.error) ===
      ONE_TIME_FORM_NOT_FOUND ? (
      <NotFoundState />
    ) : (
      <LoadErrorState onRetry={() => formQuery.refetch()} />
    );
  }
  if (myApplicationQuery.isError) {
    return <LoadErrorState onRetry={() => myApplicationQuery.refetch()} />;
  }
  if (shouldLeave || !application) return <LoadingState />;

  const { form } = formQuery.data;
  const productName = form.paymentProductName ?? form.title;
  // 무료 폼은 payment 가 null 이라 금액을 쓰지 않는다. 0원 결제는 0원으로 보인다
  const summary = application.payment
    ? `${productName} · ${application.payment.paidAmount.toLocaleString('ko-KR')}원`
    : productName;

  const handleClose = () => closeWindowOrGoHome(window, () => router.push('/'));

  return (
    <FormPopupShell
      title="신청 완료"
      footer={
        <div className="flex gap-2">
          <Link
            href={`/form/${slug}/my`}
            className={`${lineButtonClass} w-[136px] flex-none`}
          >
            신청 확인·취소
          </Link>
          <button
            type="button"
            onClick={handleClose}
            className={primaryButtonClass}
          >
            닫기
          </button>
        </div>
      }
    >
      <div className="flex h-full flex-col items-center justify-center px-1 py-8 text-center">
        <div
          aria-hidden
          className="bg-primary-10 text-primary grid h-16 w-16 place-items-center rounded-full"
        >
          <Check size={30} strokeWidth={2.4} />
        </div>
        <h2 className="text-small20 mt-5 font-bold">
          {form.isPaid ? '신청과 결제가 완료됐어요' : '신청이 완료됐어요'}
        </h2>
        <p className="text-xsmall14 text-neutral-35 mt-2 break-keep leading-relaxed">
          {summary}
        </p>
        {form.completionMessage ? (
          <div className="bg-neutral-95 text-xsmall14 text-neutral-20 mt-6 w-full whitespace-pre-line rounded-md p-4 text-left leading-relaxed">
            <b className="text-xxsmall12 text-neutral-40 mb-1 block font-semibold">
              안내
            </b>
            {form.completionMessage}
          </div>
        ) : null}
        <p className="text-xxsmall12 text-neutral-40 mt-2 break-keep leading-relaxed">
          신청 내용 확인과 취소는{' '}
          {formatMonthDayWithWeekday(application.cancelDeadline)}까지 신청 확인
          페이지에서 할 수 있어요.
        </p>
      </div>
    </FormPopupShell>
  );
};

export default CompletePage;
