import { usePaymentQuery } from '@/api/payment/payment';
import { PaymentType } from '@/api/payment/paymentSchema';
import dayjs from '@/lib/dayjs';
import Link from 'next/link';
import CreditDateContainer from '../CreditDateContainer';
import CreditListItem from '../CreditListItem';

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

const CreditList = () => {
  const { data: paymentData, isLoading, isError } = usePaymentQuery();

  return (
    <section className="flex flex-col">
      <h1 className="text-lg font-semibold">결제내역</h1>
      <h2 className="pt-6 font-semibold">결제프로그램</h2>
      <div className="flex w-full flex-col gap-y-10 py-5">
        {paymentData ? (
          paymentData.payments.length > 0 ? (
            Object.entries(groupByDate(paymentData.payments)).map(
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
            )
          ) : (
            <div className="flex w-full flex-col items-center gap-4 py-14">
              <p className="text-neutral-0 text-opacity-[36%]">
                결제한 프로그램이 아직 없어요.
              </p>
              <Link
                href="/program"
                className="other_program rounded-sm border-2 border-primary-xlight bg-white px-5 py-2 font-medium text-neutral-35"
              >
                다른 프로그램 둘러보기
              </Link>
            </div>
          )
        ) : (
          <div className="flex w-full items-center justify-center gap-3 py-5">
            {isLoading ? (
              <p className="text-neutral-0">결제내역을 불러오는 중입니다..</p>
            ) : isError ? (
              <p className="text-neutral-0">
                결제내역을 불러오는 중 오류가 발생했습니다.
              </p>
            ) : (
              <p className="text-neutral-0">결제내역이 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CreditList;
