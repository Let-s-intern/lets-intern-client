import { paymentListQueryOptions } from '@/api/payment/payment';
import { PaymentType } from '@/api/payment/paymentSchema';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import dayjs from '@/lib/dayjs';
import useAuthStore from '@/store/useAuthStore';
import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import CreditDateContainer from './CreditDateContainer';
import CreditListItem from './CreditListItem';

const groupByDate = (data: PaymentType[]) => {
  return data.reduce((acc: Record<string, PaymentType[]>, payment) => {
    const date = dayjs(payment.programInfo.createDate).format('YYYY.MM.DD');

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(payment);
    return acc;
  }, {});
};

export default function CreditList() {
  // 로그인 상태에서만 suspense 쿼리를 실행한다.
  // 빌드 타임 prerender 시점에는 인증 스토어가 미초기화(isLoggedIn=false)라
  // 쿼리를 실행하지 않아 정적 생성 중 API 호출(prerender 에러)을 방지한다.
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const pendingFallback = (
    <div className="flex w-full items-center justify-center gap-3 py-5">
      <p className="text-neutral-0">결제내역을 불러오는 중입니다..</p>
    </div>
  );

  return (
    <section className="flex flex-col">
      <h1 className="text-lg font-semibold">결제내역</h1>
      <h2 className="pt-6 font-semibold">결제프로그램</h2>
      <div className="flex w-full flex-col gap-y-10 py-5">
        <AsyncBoundary
          pendingFallback={pendingFallback}
          rejectedFallback={() => (
            <div className="flex w-full items-center justify-center gap-3 py-5">
              <p className="text-neutral-0">
                결제내역을 불러오는 중 오류가 발생했습니다.
              </p>
            </div>
          )}
        >
          {isLoggedIn ? <CreditListContent /> : pendingFallback}
        </AsyncBoundary>
      </div>
    </section>
  );
}

function CreditListContent() {
  const { data: paymentData } = useSuspenseQuery(paymentListQueryOptions);

  if (paymentData.payments.length === 0) {
    return (
      <div className="flex w-full flex-col items-center gap-4 py-14">
        <p className="text-neutral-0 text-opacity-[36%]">
          결제한 프로그램이 아직 없어요.
        </p>
        <Link
          href="/program"
          className="other_program border-primary-xlight text-neutral-35 rounded-sm border-2 bg-white px-5 py-2 font-medium"
        >
          다른 프로그램 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <>
      {Object.entries(groupByDate(paymentData.payments)).map(
        ([date, payments]) => (
          <div key={date} className="flex flex-col gap-y-3">
            <CreditDateContainer date={date} />
            <div className="flex w-full flex-col gap-y-3">
              {payments.map((payment) => (
                <CreditListItem
                  key={payment.programInfo.paymentId}
                  payment={payment}
                />
              ))}
            </div>
          </div>
        ),
      )}
    </>
  );
}
