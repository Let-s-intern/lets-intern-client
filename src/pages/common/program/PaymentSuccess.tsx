import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PostApplicationInterface,
  usePostApplicationMutation,
} from '../../../api/application';
import DescriptionBox from '../../../components/common/program/paymentSuccess/DescriptionBox';
import PaymentInfoRow from '../../../components/common/program/paymentSuccess/PaymentInfoRow';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const { mutate, isPending, isSuccess, isError, data } =
    usePostApplicationMutation(
      () => {},
      () => {},
    );

  useEffect(() => {
    const params = {
      programId: Number(searchParams.get('programId')),
      programType: searchParams.get('programType') as string,
      couponId:
        searchParams.get('couponId') === 'null'
          ? null
          : Number(searchParams.get('couponId')),
      priceId: Number(searchParams.get('priceId')),
      price: Number(searchParams.get('price')),
      discount: Number(searchParams.get('discount')),
      couponPrice: Number(searchParams.get('couponPrice')),
      paymentKey: searchParams.get('paymentKey') as string,
      orderId: searchParams.get('orderId') as string,
      amount: searchParams.get('amount') as string,
      contactEmail: searchParams.get('contactEmail') as string,
      question: searchParams.get('question') as string,
    };

    if (
      !(
        params.programId !== null &&
        params.programType !== null &&
        params.priceId !== null &&
        params.price !== null &&
        params.discount !== null &&
        params.couponPrice !== null &&
        params.paymentKey !== null &&
        params.orderId !== null &&
        params.amount !== null &&
        params.contactEmail !== null &&
        params.question !== null
      )
    ) {
      alert('잘못된 접근입니다.');
      return;
    }

    const requestBody: PostApplicationInterface = {
      paymentInfo: {
        couponId: params.couponId,
        priceId: params.priceId,
        paymentKey: params.paymentKey,
        orderId: params.orderId,
        amount: params.amount,
      },
      contactEmail: params.contactEmail,
      motivate: '',
      question: params.question,
    };

    mutate({
      programId: params.programId,
      programType: params.programType.toUpperCase(),
      requestBody,
    });
  }, [searchParams, mutate]);

  const dayArray = ['일', '월', '화', '수', '목', '금', '토'];

  const getApprovedDateFormat = (date: string) => {
    const approvedDate = new Date(date);
    return `${approvedDate.getFullYear()}.${
      approvedDate.getMonth() + 1
    }.${approvedDate.getDate()} (${dayArray[approvedDate.getDay()]})`;
  };

  useEffect(() => {
    console.log('isSuccess, ', isSuccess);
    console.log('isPending, ', isPending);
    console.log('isError, ', isError);
  }, [isSuccess, isPending, isError]);

  return (
    <div className="w-full px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex w-full items-center justify-start py-6 text-xl font-bold">
          결제 확인하기
        </div>
        <div className="flex min-h-52 w-full flex-col items-center justify-center">
          {isPending ? (
            <div>결제 확인 중입니다.</div>
          ) : (
            <>
              <DescriptionBox isSuccess={isSuccess} />
              <div className="flex w-full flex-col items-center justify-start gap-y-10 py-8">
                <div className="flex w-full flex-col items-start justify-center gap-6">
                  <div className="font-semibold text-neutral-0">
                    결제 프로그램
                  </div>
                  <div className="flex w-full items-center justify-start gap-x-4"></div>
                  {isSuccess && (
                    <button className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-neutral-100 px-6 py-3 text-lg font-medium text-primary-dark">
                      다른 프로그램 둘러보기
                    </button>
                  )}
                </div>
                <div className="flex w-full flex-col items-start justify-center gap-6">
                  <div className="font-semibold text-neutral-0">결제 상세</div>
                  <div className="flex w-full items-center justify-between gap-x-4 bg-neutral-90 px-3 py-5">
                    <div className="font-bold">총 결제금액</div>
                    <div>
                      {Number(searchParams.get('amount')).toLocaleString() +
                        '원'}
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center">
                    <PaymentInfoRow
                      title="상품금액"
                      content={
                        Number(searchParams.get('price')).toLocaleString() +
                        '원'
                      }
                    />
                    <PaymentInfoRow
                      title={`할인 (${Math.floor(Number(searchParams.get('discount')) / Number(searchParams.get('price')))}%)`}
                      content={
                        '-' +
                        Number(searchParams.get('discount')).toLocaleString() +
                        '원'
                      }
                    />
                    <PaymentInfoRow
                      title={`쿠폰할인`}
                      content={
                        '-' +
                        Number(
                          searchParams.get('couponPrice'),
                        ).toLocaleString() +
                        '원'
                      }
                    />
                  </div>
                  <hr className="bg-neutral-85" />
                  <div className="flex w-full flex-col items-center justify-center">
                    {isSuccess && (
                      <>
                        <PaymentInfoRow
                          title="결제일자"
                          content={getApprovedDateFormat(
                            data?.data.data.tossInfo.approvedAt,
                          )}
                        />
                        <PaymentInfoRow
                          title="결제수단"
                          content={data?.data.data.tossInfo.method}
                        />
                        <div className="flex w-full items-center justify-start gap-x-2 px-3 py-2">
                          <div className="text-neutral-40">영수증</div>
                          <div className="flex grow items-center justify-end text-neutral-0">
                            <button
                              className="flex items-center justify-center rounded-sm border border-neutral-60 bg-white px-3 py-2 text-sm font-medium"
                              onClick={() => {
                                window.open(
                                  data?.data.data.tossInfo.receipt.url,
                                  '_blank',
                                );
                              }}
                            >
                              영수증 보기
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {isSuccess && (
                    <button className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-neutral-100 px-6 py-3 text-lg font-medium text-primary-dark">
                      다른 프로그램 둘러보기
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
