'use client';

// 가이드북 구매. 오공고 등 외부 화면이 팝업으로 여는 작은 창이라 헤더 없이 카드 하나로 그린다.
import { useProgramApplicationQuery } from '@/api/application';
import { useProgramQuery } from '@/api/program';
import { useUserQuery } from '@/api/user/user';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { useGetMembershipPrivilege } from '@/domain/all-in-one-pass/api/privilege';
import { generateOrderId, getPayInfo } from '@/lib/order';
import useAuthStore from '@/store/useAuthStore';
import {
  loadTossPayments,
  WidgetPaymentMethodWidget,
} from '@tosspayments/tosspayments-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { buildPurchasePath, RETURN_URL_PARAM } from '../utils/purchasePath';
import GuidebookPurchaseCard from './GuidebookPurchaseCard';
import PurchaseCloseButton from './PurchaseCloseButton';

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

type TossWidgets = ReturnType<
  Awaited<ReturnType<typeof loadTossPayments>>['widgets']
>;

interface PurchaseProduct {
  guidebookId: number;
  title: string;
  priceId: number;
  amount: number;
  returnUrl: string | null;
}

const PRIMARY_BUTTON_CLASS =
  'text-1.125-medium block w-full rounded-md bg-primary px-6 py-3 font-medium text-neutral-100 disabled:opacity-50';

const Notice = ({ children }: { children: string }) => (
  <p className="py-10 text-center text-xsmall14 text-neutral-30">{children}</p>
);

const BENEFIT_FREE_LABEL = '올인원패스 혜택으로 무료';

const ProductSummary = ({
  thumbnail,
  title,
  amount,
  benefitFree,
}: {
  thumbnail?: string | null;
  title: string;
  amount: number;
  benefitFree: boolean;
}) => (
  <div className="flex items-center gap-3">
    {thumbnail && (
      <img
        src={thumbnail}
        alt=""
        className="h-16 w-16 shrink-0 rounded-xs object-cover"
      />
    )}
    <span className="min-w-0">
      <span className="block text-xsmall14 font-medium">{title}</span>
      <span className="mt-0.5 block text-xsmall14 font-semibold text-neutral-0">
        {benefitFree
          ? BENEFIT_FREE_LABEL
          : amount === 0
            ? '무료'
            : `${amount.toLocaleString()}원`}
      </span>
    </span>
  </div>
);

const GuidebookPaidPayment = ({ product }: { product: PurchaseProduct }) => {
  const { data: user } = useUserQuery();
  const [widgets, setWidgets] = useState<TossWidgets | null>(null);
  const [methods, setMethods] = useState<WidgetPaymentMethodWidget | null>(
    null,
  );
  const [ready, setReady] = useState(false);
  const tossInitialized = useRef(false);
  const orderId = useRef(generateOrderId());

  useEffect(() => {
    if (!user || tossInitialized.current) return;
    tossInitialized.current = true;
    (async () => {
      const tossPayments = await loadTossPayments(clientKey);
      const w = tossPayments.widgets({
        customerKey: (user.id ?? '').slice(0, 16),
      });
      setWidgets(w);
      await w.setAmount({ currency: 'KRW', value: product.amount });
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
  }, [user, product.amount]);

  const handlePay = async () => {
    if (!widgets) return;
    const paymentMethod = await methods?.getSelectedPaymentMethod();
    const params = { priceId: String(product.priceId) };
    const toUrl = (step: 'result' | 'fail') =>
      window.location.origin +
      buildPurchasePath({
        guidebookId: product.guidebookId,
        step,
        returnUrl: product.returnUrl,
        params:
          step === 'result' && paymentMethod?.code
            ? { ...params, paymentMethodKey: paymentMethod.code }
            : params,
      });

    try {
      await widgets.requestPayment({
        orderId: orderId.current,
        orderName: product.title,
        successUrl: toUrl('result'),
        failUrl: toUrl('fail'),
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
      <div id="payment-method" className="-mx-5" />
      <div id="agreement" className="-mx-5" />
      <button
        type="button"
        className={PRIMARY_BUTTON_CLASS}
        disabled={!ready}
        onClick={handlePay}
      >
        {product.amount.toLocaleString()}원 결제하기
      </button>
    </>
  );
};

// 0원이면 토스를 거치지 않고 결과 화면이 바로 신청한다(결제 키 없이)
const GuidebookFreeApply = ({ product }: { product: PurchaseProduct }) => {
  const router = useRouter();
  const orderId = useRef(generateOrderId());

  const handleApply = () => {
    router.push(
      buildPurchasePath({
        guidebookId: product.guidebookId,
        step: 'result',
        returnUrl: product.returnUrl,
        params: {
          priceId: String(product.priceId),
          orderId: orderId.current,
          amount: '0',
          free: 'true',
        },
      }),
    );
  };

  return (
    <button
      type="button"
      className={PRIMARY_BUTTON_CLASS}
      onClick={handleApply}
    >
      무료로 신청하기
    </button>
  );
};

// 혜택 조회는 로그인 뒤 이 컴포넌트가 뜰 때만 한다. 비로그인 응답(false)이 캐시에 남지 않게 한다
const GuidebookPurchaseOffer = ({
  product,
  thumbnail,
}: {
  product: PurchaseProduct;
  thumbnail?: string | null;
}) => {
  const privilegeQuery = useGetMembershipPrivilege(
    'GUIDEBOOK',
    product.guidebookId,
  );

  // isFetching: 결과 화면에서 돌아올 때 캐시된 값을 그대로 쓰지 않고 새 응답을 기다린다
  if (privilegeQuery.isPending || privilegeQuery.isFetching) {
    return <LoadingContainer className="py-10" />;
  }
  if (privilegeQuery.isError) {
    return (
      <>
        <Notice>구매 정보를 불러오지 못했어요</Notice>
        <button
          type="button"
          className={PRIMARY_BUTTON_CLASS}
          onClick={() => privilegeQuery.refetch()}
        >
          다시 불러오기
        </button>
      </>
    );
  }

  const amount = product.amount;
  const payProduct = product;
  return (
    <>
      <ProductSummary
        thumbnail={thumbnail}
        title={product.title}
        amount={amount}
        benefitFree={false}
      />
      {amount === 0 ? (
        <GuidebookFreeApply product={payProduct} />
      ) : (
        <GuidebookPaidPayment product={payProduct} />
      )}
    </>
  );
};

export default function GuidebookPurchaseView({
  guidebookId,
}: {
  guidebookId: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, isInitialized } = useAuthStore();
  const guidebookQuery = useProgramQuery({
    type: 'guidebook',
    programId: guidebookId,
  }).query;
  const applicationQuery = useProgramApplicationQuery(
    'guidebook',
    guidebookId,
    { enabled: isLoggedIn },
  );

  useEffect(() => {
    if (!isInitialized || isLoggedIn) return;
    const params = new URLSearchParams({
      redirect: buildPurchasePath({
        guidebookId,
        returnUrl: searchParams.get(RETURN_URL_PARAM),
      }),
    });
    router.replace(`/login?${params}`);
  }, [isInitialized, isLoggedIn, guidebookId, searchParams, router]);

  const guidebook = guidebookQuery.data;
  const application = applicationQuery.data;
  const payInfo = application ? getPayInfo(application) : null;
  const amount = payInfo ? Math.max(payInfo.price - payInfo.discount, 0) : 0;
  const title = guidebook?.title ?? '가이드북';

  const renderBody = () => {
    if (!isLoggedIn || guidebookQuery.isLoading || applicationQuery.isLoading) {
      return <LoadingContainer className="py-10" />;
    }
    if (guidebookQuery.isError || applicationQuery.isError) {
      return <Notice>상품 정보를 불러오지 못했어요.</Notice>;
    }
    if (application?.applied) {
      return (
        <>
          <Notice>이미 구매했어요.</Notice>
          <PurchaseCloseButton label="확인하기" />
        </>
      );
    }
    if (!payInfo) {
      return <Notice>지금은 구매할 수 없는 상품이에요.</Notice>;
    }

    const product: PurchaseProduct = {
      guidebookId,
      title,
      priceId: payInfo.priceId,
      amount,
      returnUrl: searchParams.get(RETURN_URL_PARAM),
    };
    return (
      <GuidebookPurchaseOffer
        product={product}
        thumbnail={guidebook?.thumbnail}
      />
    );
  };

  return (
    <GuidebookPurchaseCard title="가이드북 구매">
      {renderBody()}
    </GuidebookPurchaseCard>
  );
}
