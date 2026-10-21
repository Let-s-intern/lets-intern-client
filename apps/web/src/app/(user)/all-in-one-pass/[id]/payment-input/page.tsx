'use client';

// 올인원패스 결제정보 입력 — 프로그램 /payment-input 섹션 재사용, 멤버십 전용 스토어. 쿠폰 보류.

import { Duration } from '@/common/Duration';
import BackHeader from '@/common/header/BackHeader';
import LoadingContainer from '@/common/loading/LoadingContainer';
import useMembershipOrderStore from '@/domain/all-in-one-pass/store/useMembershipOrderStore';
import OrderProgramInfo from '@/domain/program/OrderProgramInfo';
import PaymentSubmitSection from '@/domain/program/program-detail/apply/section/PaymentSubmitSection';
import PriceSection from '@/domain/program/program-detail/apply/section/PriceSection';
import UserInputSection from '@/domain/program/program-detail/apply/section/UserInputSection';
import dayjs from '@/lib/dayjs';
import useAuthStore from '@/store/useAuthStore';
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

  const totalPrice = data.totalPrice ?? 0;
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
        {data.deadline ? (
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

      {!data.isFree && (
        <div className="mx-5 mb-10 flex flex-col gap-y-6">
          <div className="text-neutral-0 font-semibold">결제 정보</div>
          <div className="flex flex-col gap-y-5">
            <PriceSection
              payInfo={{
                price: data.price ?? 0,
                discount: data.discount ?? 0,
              }}
              coupon={{ id: null, price: 0 }}
              showCouponDiscount={false}
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
