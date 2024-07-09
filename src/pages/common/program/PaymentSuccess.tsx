import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  PostApplicationInterface,
  usePostApplicationMutation,
} from '../../../api/application';
import PriceSection from '../../../components/common/program/program-detail/apply/section/PriceSection';
import { PayInfo } from '../../../components/common/program/program-detail/section/ApplySection';
import { ProgramType } from './ProgramDetail';

const PaymentSuccess = ({ programType }: { programType: ProgramType }) => {
  const [searchParams] = useSearchParams();
  const params = useParams<{ programId: string }>();

  const payInfo: PayInfo = {
    priceId: Number(searchParams.get('priceId')),
    couponId: Number(searchParams.get('couponId')),
    price: Number(searchParams.get('price')),
    discount: Number(searchParams.get('discount')),
    couponPrice: Number(searchParams.get('couponPrice')),
    livePriceType: '',
    challengePriceType: '',
  };

  const totalPrice = () => {
    const totalDiscount =
      payInfo.couponPrice === -1
        ? payInfo.price
        : payInfo.discount + payInfo.couponPrice;
    if (payInfo.price <= totalDiscount) return 0;
    else return payInfo.price - totalDiscount;
  };

  const requestBody: PostApplicationInterface = {
    paymentInfo: {
      couponId: payInfo.couponId,
      priceId: payInfo.priceId,
      paymentKey: searchParams.get('paymentKey') as string,
      orderId: searchParams.get('orderId') as string,
      amount: searchParams.get('amount') as string,
    },
    contactEmail: 'kaj1226@naver.com',
    motivate: '',
    question: '',
  };

  const successCallback = () => {
    console.log('success');
  };

  const errorCallback = (error: Error) => {
    console.log(error);
  };

  const { mutate, data, isError } = usePostApplicationMutation(
    Number(params.programId),
    programType,
    requestBody,
    successCallback,
    errorCallback,
  );

  useEffect(() => {
    console.log('PARAMS --> ', params);
    console.log('SEARCH PARAMS --> ', searchParams);
  }, [params, searchParams]);

  useEffect(() => {
    if (
      !params.programId ||
      !searchParams.get('priceId') ||
      !searchParams.get('couponId') ||
      !searchParams.get('price') ||
      !searchParams.get('discount') ||
      !searchParams.get('couponPrice') ||
      !searchParams.get('paymentKey') ||
      !searchParams.get('orderId') ||
      !searchParams.get('amount')
    ) {
      console.error('필수 정보가 없습니다.');
      return;
    }

    mutate();
  }, [params, searchParams, mutate]);

  return (
    <div className="px-5">
      <div className="mx-auto max-w-5xl pb-10">
        <header className="flex items-center gap-3 py-5">
          <h1 className="text-lg font-medium">결제 확인</h1>
        </header>
        <div className="flex w-full flex-col items-center justify-start gap-10 md:mt-8">
          {data ? (
            <>
              {/* 프로그램 정보 */}
              <section className="flex w-full flex-col items-start justify-center gap-5">
                <div className="text-xl font-medium">프로그램 정보</div>
                <div className="flex w-full items-center justify-between gap-10">
                  <img
                    className="h-[200px] w-[300px] bg-neutral-30"
                    src="/images/program/program-detail/program-info.png"
                    alt="프로그램 썸네일"
                  />
                  <div className="flex grow flex-col items-start justify-center">
                    <div>{`프로그램명 : ${'programTitle'}`}</div>
                    <div>{`진행 기간 : ${'period'}`}</div>
                  </div>
                </div>
              </section>
              {/* 결제 정보 */}
              <section className="flex w-full flex-col items-start justify-center gap-5">
                <hr className="bg-neutral-85" />
                <PriceSection payInfo={payInfo} totalPrice={totalPrice()} />
              </section>
              <button
                className="complete_button text-1.125-medium flex w-full justify-center rounded-md bg-primary px-6 py-3 font-medium text-neutral-100"
                onClick={() => {}}
              >
                영수증 보기
              </button>
            </>
          ) : isError ? (
            <div>결제에 실패했습니다.</div>
          ) : (
            <div>결제 확인 중입니다..</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
