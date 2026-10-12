import { paymentListQueryOptions } from '@/api/payment/payment';
import { PaymentType } from '@/api/payment/paymentSchema';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import dayjs from '@/lib/dayjs';
import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { groupPaymentsByTransaction } from '../lib/groupPaymentsByTransaction';
import CreditDateContainer from './CreditDateContainer';
import CreditListItem from './CreditListItem';
import CreditTransactionGroup from './CreditTransactionGroup';

/** 같은 PG 거래의 행은 한 묶음이다. 묶음의 날짜는 첫 행 기준이다 */
const groupByDate = (data: PaymentType[][]) => {
  return data.reduce((acc: Record<string, PaymentType[][]>, group) => {
    const date = dayjs(group[0].programInfo.createDate).format('YYYY.MM.DD');

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(group);
    return acc;
  }, {});
};

export default function CreditList() {
  return (
    <section className="flex flex-col">
      <h1 className="text-lg font-semibold">결제내역</h1>
      <h2 className="pt-6 font-semibold">결제프로그램</h2>
      <div className="flex w-full flex-col gap-y-10 py-5">
        <AsyncBoundary
          pendingFallback={
            <div className="flex w-full items-center justify-center gap-3 py-5">
              <p className="text-neutral-0">결제내역을 불러오는 중입니다..</p>
            </div>
          }
          rejectedFallback={() => (
            <div className="flex w-full items-center justify-center gap-3 py-5">
              <p className="text-neutral-0">
                결제내역을 불러오는 중 오류가 발생했습니다.
              </p>
            </div>
          )}
        >
          <CreditListContent />
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
      {Object.entries(
        groupByDate(groupPaymentsByTransaction(paymentData.payments)),
      ).map(([date, groups]) => (
        <div key={date} className="flex flex-col gap-y-3">
          <CreditDateContainer date={date} />
          <div className="flex w-full flex-col gap-y-3">
            {groups.map((group) =>
              group.length === 1 ? (
                <CreditListItem
                  key={group[0].programInfo.paymentId}
                  payment={group[0]}
                />
              ) : (
                <CreditTransactionGroup
                  key={group[0].programInfo.paymentId}
                  payments={group}
                />
              ),
            )}
          </div>
        </div>
      ))}
    </>
  );
}
