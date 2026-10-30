'use client';

// 올인원패스 결제정보 입력 — 프로그램 /payment-input 섹션 재사용, 멤버십 전용 스토어.

import { useMyCoupons } from '@/api/coupon/coupon';
import { Duration } from '@/common/Duration';
import BackHeader from '@/common/header/BackHeader';
import LoadingContainer from '@/common/loading/LoadingContainer';
import useMembershipOrderStore, {
  type MembershipOrderData,
} from '@/domain/all-in-one-pass/store/useMembershipOrderStore';
import {
  getMembershipOrderTotal,
  getMembershipOrderTotals,
} from '@/domain/all-in-one-pass/utils/vodPassOrder';
import OrderProgramInfo from '@/domain/program/OrderProgramInfo';
import CouponSection from '@/domain/program/program-detail/apply/section/CouponSection';
import PaymentSubmitSection from '@/domain/program/program-detail/apply/section/PaymentSubmitSection';
import PriceSection from '@/domain/program/program-detail/apply/section/PriceSection';
import UserInputSection from '@/domain/program/program-detail/apply/section/UserInputSection';
import dayjs from '@/lib/dayjs';
import useAuthStore from '@/store/useAuthStore';
import { ICouponForm } from '@/types/interface';
import { isValidEmail } from '@/utils/valid';
import { NoticeDialog } from '@letscareer/ui';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function MembershipPaymentInputPage() {
  const params = useParams<{ id: string }>();
  const membershipId = Number(params.id);
  const router = useRouter();

  const { isLoggedIn, isInitialized } = useAuthStore();
  const { data, _hasHydrated, setOrder, initOrder, checkInvalidate } =
    useMembershipOrderStore();

  const [invalidAccess, setInvalidAccess] = useState(false);

  useEffect(() => {
    if (!isInitialized || !_hasHydrated) return;
    if (checkInvalidate() || !isLoggedIn) setInvalidAccess(true);
  }, [isInitialized, _hasHydrated, isLoggedIn, checkInvalidate]);

  const userInfo = {
    name: data.name ?? '',
    email: data.email ?? '',
    phoneNumber: data.phone ?? '',
    contactEmail: data.contactEmail ?? '',
    question: '',
    initialized: true,
  };

  const { data: myCoupons = [] } = useMyCoupons('MEMBERSHIP');
  const [coupon, setCouponState] = useState<ICouponForm>({
    id: null,
    price: 0,
  });
  const basePrice = data.price ?? 0;
  const baseDiscount = data.discount ?? 0;
  const originalTotal = Math.max(basePrice - baseDiscount, 0);

  // VOD 이용권은 플랜 선택 시트에서 고른 값을 합계·결제 정보에만 보여준다 (LC-3533)
  const vodPassPrice = data.vodPassPrice ?? 0;

  // 쿠폰이 바뀌면 VOD 선택을 포함한 결제 금액과 무료 여부를 같은 함수로 다시 담는다
  const updateOrder = (changes: Partial<MembershipOrderData>) =>
    setOrder({
      ...changes,
      ...getMembershipOrderTotals({ ...data, ...changes }),
    });

  // CouponSection 은 {id, price} 만 주므로 내 쿠폰 목록에서 code 를 역매핑해 store 에 저장
  const handleCoupon = (
    next: ((prev: ICouponForm) => ICouponForm) | ICouponForm,
  ) => {
    const resolved = typeof next === 'function' ? next(coupon) : next;
    const code =
      myCoupons.find((c) => c.couponId === resolved.id)?.code ?? null;
    setCouponState(resolved);
    updateOrder({ couponCode: code, couponPrice: resolved.price });
  };

  const totalPrice = getMembershipOrderTotal(data);
  const buttonText = data.isFree ? '0원 결제하기' : '결제하기';
  const isFormValid =
    userInfo.initialized && isValidEmail(data.contactEmail ?? '');

  const onPaymentClick = useCallback(() => {
    if (totalPrice !== 0) {
      router.push(`/all-in-one-pass/${membershipId}/payment`);
    } else {
      router.push(`/all-in-one-pass/${membershipId}/order/result`);
    }
  }, [totalPrice, router, membershipId]);

  const goHome = useCallback(() => {
    initOrder();
    router.push('/');
  }, [initOrder, router]);

  if (invalidAccess) {
    return (
      <NoticeDialog
        open={invalidAccess}
        onOpenChange={(open) => {
          if (!open) goHome();
        }}
        title="잘못된 접근입니다."
        description="정상적인 경로로 다시 접근해 주세요."
      />
    );
  }

  if (!_hasHydrated) {
    return <LoadingContainer />;
  }

  return (
    <div className="mx-auto w-full max-w-[55rem] pb-6 md:pt-5">
      <BackHeader onClick={() => router.back()} className="mx-5">
        결제하기
      </BackHeader>

      <div className="mx-5">
        <OrderProgramInfo
          progressType="none"
          thumbnail={data.thumbnail ?? ''}
          title={data.passTitle ?? '올인원패스'}
          programType="membership"
          startDate={data.beginning ?? undefined}
          endDate={data.deadline ?? undefined}
        />
        {data.orderType !== 'EXTENSION' && data.deadline ? (
          <div className="bg-primary-10 text-xsmall14 -mx-5 mb-10 mt-8 flex items-center justify-center gap-2 px-2.5 py-5 lg:mx-0 lg:rounded-sm">
            <span>마감까지</span>
            <Duration
              deadline={dayjs(data.deadline)}
              numberBoxClassName="text-xsmall14 bg-white text-primary"
            />
            <span>남았어요!</span>
          </div>
        ) : (
          <div className="mt-10" />
        )}
        <p className="text-xsmall16 text-neutral-0 my-3 font-semibold">
          신청 폼을 모두 입력해주세요.
        </p>
        <div className="flex flex-col gap-2.5">
          <UserInputSection
            userInfo={userInfo}
            contactEmail={data.contactEmail ?? ''}
            setContactEmail={(contactEmail) => setOrder({ contactEmail })}
          />
        </div>
      </div>

      <hr className="bg-neutral-95 my-10 block h-2 border-none" />

      {(originalTotal > 0 || vodPassPrice > 0) && (
        <div className="mx-5 mb-10 flex flex-col gap-y-6">
          <div className="text-neutral-0 font-semibold">결제 정보</div>
          {originalTotal > 0 && (
            <CouponSection
              setCoupon={handleCoupon}
              programType="MEMBERSHIP"
              maxAmount={originalTotal}
              salePrice={originalTotal}
              allowFullDiscount={false}
            />
          )}
          <div className="flex flex-col gap-y-5">
            <PriceSection
              payInfo={{ price: basePrice, discount: baseDiscount }}
              coupon={coupon}
              showCouponDiscount={true}
              vodPassPrice={vodPassPrice}
              vodPassMonths={data.vodPassMonths ?? 0}
            />
            <hr className="bg-neutral-85" />
            <div className="text-neutral-0 flex h-10 items-center justify-between px-3 font-semibold">
              <span>결제금액</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      )}

      <PaymentSubmitSection
        onSubmit={onPaymentClick}
        buttonText={buttonText}
        disabled={!isFormValid}
      />
    </div>
  );
}
