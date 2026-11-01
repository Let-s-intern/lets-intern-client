'use client';

// VOD 이용권 단독 구매. 링크로 바로 들어오는 작은 창이라 헤더 없이 카드 하나로 그린다.
import { useUserQuery } from '@/api/user/user';
import LoadingContainer from '@/common/loading/LoadingContainer';
import {
  calculateVodPassDurationDays,
  calculateVodPassPrice,
  clampVodPassMonths,
  getVodPassMaxMonths,
  isVodPassPurchasable,
  VOD_PASS_MIN_MONTHS,
} from '@/domain/program/vodPassPurchase';
import { generateOrderId } from '@/lib/order';
import useAuthStore from '@/store/useAuthStore';
import {
  loadTossPayments,
  WidgetPaymentMethodWidget,
} from '@tosspayments/tosspayments-sdk';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  useStandaloneVodPassProductQuery,
  type StandaloneVodPassProduct,
} from '../api';
import VodPassPurchaseCard from './VodPassPurchaseCard';

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

const STEPPER_BUTTON_CLASS =
  'border-neutral-80 text-neutral-10 disabled:text-neutral-60 rounded-xs flex h-8 w-8 items-center justify-center border bg-white text-base font-bold disabled:cursor-not-allowed';

type TossWidgets = ReturnType<
  Awaited<ReturnType<typeof loadTossPayments>>['widgets']
>;

const VodPassPayment = ({ product }: { product: StandaloneVodPassProduct }) => {
  const { data: user } = useUserQuery();
  const [months, setMonths] = useState(VOD_PASS_MIN_MONTHS);
  const [widgets, setWidgets] = useState<TossWidgets | null>(null);
  const [methods, setMethods] = useState<WidgetPaymentMethodWidget | null>(
    null,
  );
  const [ready, setReady] = useState(false);
  const tossInitialized = useRef(false);
  const orderId = useRef(generateOrderId());

  const maxMonths = getVodPassMaxMonths(product);
  const price = calculateVodPassPrice(product, months);
  const durationDays = calculateVodPassDurationDays(product, months);

  useEffect(() => {
    if (!user || tossInitialized.current) return;
    tossInitialized.current = true;
    (async () => {
      const tossPayments = await loadTossPayments(clientKey);
      const w = tossPayments.widgets({
        customerKey: (user.id ?? '').slice(0, 16),
      });
      setWidgets(w);
      await w.setAmount({ currency: 'KRW', value: price });
      const m = await w.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'widgetA',
      });
      setMethods(m);
      await w.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });
      setReady(true);
    })();
  }, [user, price]);

  useEffect(() => {
    if (ready) widgets?.setAmount({ currency: 'KRW', value: price });
  }, [ready, widgets, price]);

  const handleChangeMonths = (next: number) => {
    setMonths(clampVodPassMonths(next, maxMonths));
  };

  const handlePay = async () => {
    if (!widgets) return;
    const paymentMethod = await methods?.getSelectedPaymentMethod();
    const params = new URLSearchParams({
      productId: String(product.id),
      months: String(months),
      expectedPrice: String(price),
      expectedDurationDays: String(durationDays),
    });
    if (paymentMethod?.code) params.set('paymentMethodKey', paymentMethod.code);
    const resultUrl = `${window.location.origin}/vod-pass/purchase/result?${params}`;

    try {
      await widgets.requestPayment({
        orderId: orderId.current,
        orderName: product.title,
        successUrl: resultUrl,
        failUrl: resultUrl,
        customerEmail: user?.email ?? '',
        customerName: user?.name ?? '',
        customerMobilePhone: (user?.phoneNum ?? '').replace(/[^0-9]/g, ''),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0">
          <span className="text-xsmall14 block font-medium">이용 기간</span>
          <span className="text-xxsmall12 text-neutral-30 mt-0.5 block">
            {durationDays}일 · 최대 {maxMonths}개월
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="이용 개월 수 줄이기"
            className={STEPPER_BUTTON_CLASS}
            disabled={months <= VOD_PASS_MIN_MONTHS}
            onClick={() => handleChangeMonths(months - 1)}
          >
            -
          </button>
          <span
            className="text-xsmall14 min-w-[3.5rem] text-center font-semibold"
            aria-live="polite"
          >
            {months}개월
          </span>
          <button
            type="button"
            aria-label="이용 개월 수 늘리기"
            className={STEPPER_BUTTON_CLASS}
            disabled={months >= maxMonths}
            onClick={() => handleChangeMonths(months + 1)}
          >
            +
          </button>
        </span>
      </div>
      <p className="text-xxsmall12 text-neutral-30 leading-5">
        결제 즉시 이용이 시작됩니다. 이용 중인 이용권이 있으면 종료 후 이어서
        시작됩니다.
      </p>
      <div id="payment-method" className="-mx-5" />
      <div id="agreement" className="-mx-5" />
      <button
        type="button"
        className="bg-primary text-1.125-medium block w-full rounded-md px-6 py-3 font-medium text-neutral-100 disabled:opacity-50"
        disabled={!ready}
        onClick={handlePay}
      >
        {price.toLocaleString()}원 결제하기
      </button>
    </>
  );
};

const Notice = ({ children }: { children: string }) => (
  <p className="text-xsmall14 text-neutral-30 py-10 text-center">{children}</p>
);

export default function VodPassPurchaseView() {
  const router = useRouter();
  const { isLoggedIn, isInitialized } = useAuthStore();
  const productQuery = useStandaloneVodPassProductQuery(isLoggedIn);

  useEffect(() => {
    if (!isInitialized || isLoggedIn) return;
    const params = new URLSearchParams({ redirect: '/vod-pass/purchase' });
    router.replace(`/login?${params}`);
  }, [isInitialized, isLoggedIn, router]);

  const product = productQuery.data;

  const renderBody = () => {
    if (!isLoggedIn || productQuery.isLoading) {
      return <LoadingContainer className="py-10" />;
    }
    if (productQuery.isError) {
      return <Notice>상품 정보를 불러오지 못했어요.</Notice>;
    }
    if (!product) {
      return <Notice>지금은 VOD 이용권을 판매하지 않아요.</Notice>;
    }
    if (!isVodPassPurchasable(product)) {
      return <Notice>보유할 수 있는 VOD 이용 기간을 모두 채웠어요.</Notice>;
    }
    return <VodPassPayment product={product} />;
  };

  return (
    <VodPassPurchaseCard title={product?.title ?? 'VOD 이용권'}>
      {renderBody()}
    </VodPassPurchaseCard>
  );
}
