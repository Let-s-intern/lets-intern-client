import dayjs from 'dayjs';
import { usePaymentQuery } from '../../../../../api/payment';
import { PaymentType } from '../../../../../api/paymentSchema';
import CreditDateContainer from '../CreditDateContainer';
import CreditListItem from '../CreditListItem';

const groupByDate = (data: PaymentType[]) => {
  return data.reduce((acc: Record<string, PaymentType[]>, payment) => {
    const date = dayjs(payment.tossInfo?.requestedAt).format('YYYY.MM.DD');

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
    <section className="flex flex-col gap-y-6">
      <h1 className="text-lg font-semibold">결제내역</h1>
      <h2 className="font-semibold">결제프로그램</h2>
      <div className="flex w-full flex-col gap-y-10 py-5">
        {paymentData ? (
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
          <div className="flex w-full items-center justify-center gap-3 py-5">
            {isLoading ? (
              <p className="text-neutral-0">결제내역을 불러오는 중입니다.</p>
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
