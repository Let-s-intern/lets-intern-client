import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProgramApplicationQuery } from '../../../api/application';
import CouponSection from '../../../components/common/program/program-detail/apply/section/CouponSection';
import PriceSection from '../../../components/common/program/program-detail/apply/section/PriceSection';
import Header from '../../../components/common/program/program-detail/header/Header';
import { PayInfo } from '../../../components/common/program/program-detail/section/ApplySection';
import { ProgramType } from './ProgramDetail';

interface PaymentInfoProps {
  programType: ProgramType;
}

const PaymentInfo = ({ programType }: PaymentInfoProps) => {
  const params = useParams<{ programId: string }>();
  const { data, isLoading, isError } = useProgramApplicationQuery(
    programType,
    Number(params.programId),
  );
  const [payInfo, setPayInfo] = useState<PayInfo>({
    priceId: 0,
    couponId: null,
    price: 0,
    discount: 0,
    couponPrice: 0,
    livePriceType: '',
    challengePriceType: '',
  });
  const [totalPrice, setTotalPrice] = useState(payInfo.price);

  useEffect(() => {
    const totalDiscount =
      payInfo.couponPrice === -1
        ? payInfo.price
        : payInfo.discount + payInfo.couponPrice;
    if (payInfo.price <= totalDiscount) setTotalPrice(0);
    else setTotalPrice(payInfo.price - totalDiscount);
  }, [payInfo]);

  const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY || '';
  const customerKey = 'zOZ8i_RHluykZWVBsLqXp';
  const [amount, setAmount] = useState({
    currency: 'KRW',
    value: 50_000,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<any>(null);

  const getRandomString = (length: number) => {
    const randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length),
      );
    }
    return result;
  };

  const getOrderId = () => {
    return `${programType}-${'programId'}-${getRandomString(8)}`;
  };

  useEffect(() => {
    data &&
      (programType === 'challenge' && data.priceList
        ? setPayInfo({
            priceId: data.priceList[0].priceId || 0,
            couponId: null,
            price: data.priceList[0].price,
            discount: data.priceList[0].discount,
            couponPrice: 0,
            livePriceType: '',
            challengePriceType: data.priceList[0].challengePriceType,
          })
        : programType === 'live' && data.price
          ? setPayInfo({
              priceId: data.price.priceId || 0,
              couponId: null,
              price: data.price.price,
              discount: data.price.discount,
              couponPrice: 0,
              livePriceType: data.price.livePriceType,
              challengePriceType: '',
            })
          : setPayInfo({
              priceId: 0,
              couponId: null,
              price: 0,
              discount: 0,
              couponPrice: 0,
              livePriceType: '',
              challengePriceType: '',
            }));
  }, [programType, data]);

  // ------  결제위젯 초기화 ------
  useEffect(() => {
    const fetchPaymentWidgets = async () => {
      // ------  결제위젯 초기화 ------
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      const widgets = tossPayments.widgets({
        customerKey,
      });
      // 비회원 결제
      // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

      setWidgets(widgets);
    };

    fetchPaymentWidgets();

    return () => {
      setWidgets(null);
    };
  }, [clientKey, customerKey]);

  useEffect(() => {
    const renderPaymentWidgets = async () => {
      if (widgets == null) {
        return;
      }
      // ------ 주문의 결제 금액 설정 ------
      await widgets.setAmount(amount);

      // ------  결제 UI 렌더링 ------
      await widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'DEFAULT',
      });

      // ------  이용약관 UI 렌더링 ------
      await widgets.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });

      setReady(true);
    };

    renderPaymentWidgets();
  }, [widgets]);

  useEffect(() => {
    setAmount({
      currency: 'KRW',
      value: totalPrice,
    });
  }, [totalPrice]);

  useEffect(() => {
    if (widgets === null || amount.value === 0) {
      return;
    }

    widgets.setAmount(amount);
  }, [widgets, amount]);

  const handlePayment = async () => {
    if (widgets === null) {
      return;
    }

    const orderId = getOrderId();
    const successUrl =
      window.location.origin +
      `/program/${programType}/${params.programId}` +
      '/success?couponId=' +
      payInfo.couponId +
      '&couponPrice=' +
      payInfo.couponPrice +
      '&priceId=' +
      payInfo.priceId +
      '&discount=' +
      payInfo.discount +
      '&price=' +
      payInfo.price;

    console.log(orderId);
    console.log(amount);
    console.log(successUrl);

    try {
      await widgets.requestPayment({
        orderId: getOrderId(),
        orderName: '프로그램 결제',
        successUrl: successUrl,
        failUrl: window.location.origin + window.location.pathname + '/fail',
        customerEmail: `kaj1226@naver.com`,
        customerName: `김렛츠`,
        customerMobilePhone: `01012341234`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-5">
      <div className="mx-auto max-w-5xl pb-10">
        <Header programTitle={'결제 정보'} />
        <div className="flex w-full flex-col items-center justify-start gap-10 md:mt-8">
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
          {/* 구매자 정보 */}
          <section className="flex w-full flex-col items-start justify-center gap-5">
            <hr className="bg-neutral-85" />
            <CouponSection setPayInfo={setPayInfo} programType={programType} />
            <hr className="bg-neutral-85" />
            <PriceSection payInfo={payInfo} totalPrice={totalPrice} />
          </section>
          {/* 결제 UI */}
          <div id="payment-method" className="w-full" />
          {/* 이용약관 UI */}
          <div id="agreement" className="w-full" />
          <button
            className="complete_button text-1.125-medium flex w-full justify-center rounded-md bg-primary px-6 py-3 font-medium text-neutral-100"
            onClick={handlePayment}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
