'use client';

import { useProgramQuery } from '@/api/program';
import { usePatchUser } from '@/api/user/user';
import CreditCardIcon from '@/assets/icons/credit-card.svg?react';
import { Duration } from '@/common/Duration';
import BackHeader from '@/common/header/BackHeader';
import LoadingContainer from '@/common/loading/LoadingContainer';
// [LC-3219-MEMBERSHIP] 하반기 멤버십 전액할인 쿠폰 차단에만 쓴다 — 시즌 종료 시 이 import 를
// 지운다(아래 isMembership 블록과 짝). 담당자 임성빈
import { MEMBERSHIP_CHALLENGE_ID } from '@/domain/membership/lib/membershipChallenge';
import { COUPON_DISABLED_CHALLENGE_TYPES } from '@/domain/program/program-detail/apply/constants';
import CouponSection, {
  CouponSectionProps,
} from '@/domain/program/program-detail/apply/section/CouponSection';
import MotiveAnswerSection from '@/domain/program/program-detail/apply/section/MotiveAnswerSection';
import PaymentSubmitSection from '@/domain/program/program-detail/apply/section/PaymentSubmitSection';
import PriceSection from '@/domain/program/program-detail/apply/section/PriceSection';
import UserInputSection from '@/domain/program/program-detail/apply/section/UserInputSection';
import { useInstallmentPayment } from '@/hooks/useInstallmentPayment';
import { UserInfo } from '@/lib/order';
import { ChallengePriceInfo } from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import useProgramStore, {
  checkInvalidate,
  initProgramApplicationForm,
  setProgramApplicationForm,
} from '@/store/useProgramStore';
import { isValidEmail } from '@/utils/valid';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import { captureDomainError } from '@/utils/captureError';
import { NoticeDialog } from '@letscareer/ui';
import { ApiError } from '@letscareer/api';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import OrderProgramInfo from '../../../domain/program/OrderProgramInfo';

function calculateTotalPrice({
  regularPrice = 0,
  discount = 0,
  couponPrice = 0,
}: {
  regularPrice?: number; // 프로그램 정가
  discount?: number; // 프로그램 할인금액
  couponPrice?: number;
}) {
  const totalDiscount = discount + couponPrice;
  return regularPrice <= totalDiscount ? 0 : regularPrice - totalDiscount;
}

const PaymentInputContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allowNavigation, setAllowNavigation] = useState(false);
  const [nextPath, setNextPath] = useState('');

  // 잘못된 접근(새로고침 등) 안내 다이얼로그 노출 여부. window.alert 대체.
  const [invalidAccess, setInvalidAccess] = useState(false);

  const { data: programApplicationData } = useProgramStore();
  const { isLoggedIn, isInitialized } = useAuthStore();
  const { isLoading, months, banks } = useInstallmentPayment();
  const patchUserMutation = usePatchUser();

  const {
    query: { data: program, isLoading: programLoading },
  } = useProgramQuery({
    programId: programApplicationData.programId ?? 0,
    type: programApplicationData.programType ?? 'live',
  });

  const userInfo = {
    name: programApplicationData.name ?? '',
    email: programApplicationData.email ?? '',
    phoneNumber: programApplicationData.phone ?? '',
    contactEmail: programApplicationData.contactEmail ?? '',
    question: programApplicationData.question ?? '',
    initialized: true,
  };

  const challengeBasicPriceInfo =
    programApplicationData.programType === 'challenge' &&
    program &&
    'priceInfo' in program &&
    Array.isArray(program.priceInfo)
      ? (program.priceInfo as ChallengePriceInfo[])?.find(
          (info) => info.challengePricePlanType === 'BASIC',
        )
      : null;

  /**
   * 최대 쿠폰 할인 금액
   * @note 챌린지에 쿠폰을 적용할 때 베이직에만 적용하기 위함
   *  */
  const maxCouponAmount =
    programApplicationData.programType === 'challenge'
      ? (challengeBasicPriceInfo?.price ?? 0) +
        (challengeBasicPriceInfo?.refund ?? 0) -
        (challengeBasicPriceInfo?.discount ?? 0)
      : Infinity;

  /**
   * 쿠폰 섹션 노출 여부
   * @note 챌린지 타입이 EXPERIENCE_SUMMARY 또는 CAREER_START인 경우 쿠폰 미노출
   *       단, URL 쿼리 파라미터에 source=b2b가 있으면 노출
   */
  const hasB2BParam = searchParams.get('source') === 'b2b';
  const challengeType = (() => {
    if (programApplicationData.programType !== 'challenge') return '';
    if (!program || !('challengeType' in program)) return '';
    return program.challengeType;
  })();
  const isCouponDisabledType =
    COUPON_DISABLED_CHALLENGE_TYPES.includes(challengeType);
  const showCouponSection = !isCouponDisabledType || hasB2BParam;

  // [LC-3219-MEMBERSHIP] 시작 — 하반기 멤버십은 쿠폰을 받되 전액할인만 막는다.
  // 멤버십이 어드민 챌린지로 만들어져 있어, 예전에 챌린지용으로 뿌린 전액할인 쿠폰
  // (discount === -1)이 그대로 적용돼 169,000원이 0원이 된다. 서버는 쿠폰을 챌린지
  // ID·타입으로 제한하지 않으므로 화면에서 막는다.
  // 시즌 종료 시 이 블록과 위 MEMBERSHIP_CHALLENGE_ID import, 아래 allowFullDiscount
  // 전달부, 그리고 CouponSection 의 allowFullDiscount prop·필터를 함께 지운다.
  // grep -rn "LC-3219-MEMBERSHIP" apps/web/src 로 전부 찾힌다. 담당자 임성빈
  const isMembership =
    programApplicationData.programType === 'challenge' &&
    programApplicationData.programId === MEMBERSHIP_CHALLENGE_ID;
  // [LC-3219-MEMBERSHIP] 끝

  const setUserInfo = useCallback((info: UserInfo) => {
    const { contactEmail, email, name, phoneNumber, question } = info;
    setProgramApplicationForm({
      contactEmail,
      email,
      name,
      phone: phoneNumber,
      question,
    });
  }, []);

  const setCoupon = useCallback<CouponSectionProps['setCoupon']>(
    (coupon) => {
      const data =
        typeof coupon === 'function'
          ? coupon({
              id: programApplicationData.couponId
                ? Number(programApplicationData.couponId)
                : null,
              price: programApplicationData.couponPrice ?? 0,
            })
          : coupon;

      const newTotalPrice = calculateTotalPrice({
        regularPrice: programApplicationData.price ?? 0, // 총 정가
        discount: programApplicationData.discount ?? 0,
        couponPrice: data.price,
      });

      setProgramApplicationForm({
        couponId: String(data.id),
        couponPrice: data.price,
        totalPrice: newTotalPrice, // 결제 금액
      });
    },
    [
      programApplicationData.couponId,
      programApplicationData.couponPrice,
      programApplicationData.discount,
      programApplicationData.price,
    ],
  );

  // 결제 금액
  const totalPrice = useMemo(() => {
    const regularPrice = programApplicationData.price ?? 0;
    const discountAmount = programApplicationData.discount ?? 0;
    const couponPrice = programApplicationData.couponPrice ?? 0;
    const totalDiscount = discountAmount + couponPrice;

    return regularPrice <= totalDiscount ? 0 : regularPrice - totalDiscount;
  }, [
    programApplicationData.couponPrice,
    programApplicationData.discount,
    programApplicationData.price,
  ]);

  /** 쿠폰 적용이 아니라 애초부터 무료인 경우 다르게 보여주기 **/
  const buttonText = programApplicationData.isFree
    ? '0원 결제하기'
    : '결제하기';

  const handleSafeNavigation = useCallback((path: string) => {
    setNextPath(path);
    setAllowNavigation(true);
  }, []);

  // 약관 동의 가드·흔들림은 PaymentSubmitSection이 담당한다(동의 시에만 호출됨).
  const onPaymentClick = useCallback(async () => {
    try {
      await patchUserMutation.mutateAsync({
        contactEmail: programApplicationData.contactEmail,
      });

      if (totalPrice !== 0) {
        handleSafeNavigation('/payment');
      } else {
        handleSafeNavigation(
          `/order/result?orderId=${programApplicationData.programOrderId}`,
        );
      }
    } catch (e) {
      // axios 인터셉터가 응답 에러를 ApiError로 래핑한다([packages/api/src/createAuthorizedAxios.ts]).
      // 네트워크 실패는 래핑되지 않고 raw AxiosError로 도착하므로 두 타입 모두 처리한다.
      let serverMessage: string | undefined;
      if (e instanceof ApiError) {
        serverMessage = e.serverMessage;
      } else if (e instanceof AxiosError) {
        serverMessage = (e.response?.data as { message?: string })?.message;
      }

      captureDomainError(e, { domain: 'common', section: 'payment-input' });
      alert(
        serverMessage ??
          '결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      );
    }
  }, [
    handleSafeNavigation,
    patchUserMutation,
    programApplicationData.contactEmail,
    programApplicationData.programOrderId,
    totalPrice,
  ]);

  // 폼 자체 유효성(이메일 등). 약관 동의는 PaymentSubmitSection 내부에서 가드한다.
  const isFormValid =
    userInfo.initialized && isValidEmail(userInfo.contactEmail);

  useEffect(() => {
    // 페이지 이탈 시 실행될 함수
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!allowNavigation) {
        e.preventDefault();
        e.returnValue = '';

        setCoupon({
          id: null,
          price: 0,
        });

        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [allowNavigation, setCoupon]);

  // allowNavigation이 true로 변경되면 navigation 수행
  useEffect(() => {
    if (allowNavigation && nextPath) {
      router.push(nextPath);
      setAllowNavigation(false);
    }
  }, [allowNavigation, nextPath, router]);

  useEffect(() => {
    // 인증 스토어 하이드레이션 완료(isInitialized) 전에는 isLoggedIn이 일시적으로
    // false일 수 있어 정상 사용자에게 오탐이 난다. 초기화 완료 후에만 검증한다.
    if (!isInitialized) return;
    if (checkInvalidate() || !isLoggedIn) {
      // 기존 window.alert('잘못된 접근입니다.') 를 헤드리스 NoticeDialog(@letscareer/ui)로
      // 대체. 실제 이동/폼 초기화는 다이얼로그 확인(goHome) 시점으로 미룬다.
      setInvalidAccess(true);
    }
  }, [isInitialized, isLoggedIn]);

  const goHome = useCallback(() => {
    initProgramApplicationForm();
    router.push('/');
  }, [router]);

  // 잘못된 접근이면 폼 대신 안내 다이얼로그만 렌더(program 로딩 여부와 무관하게 노출).
  // 확인 버튼·Escape 등 어떤 방식으로 닫혀도 잘못된 접근이므로 항상 홈으로 이동한다
  // (onOpenChange에서만 goHome을 호출해 우회 방지 + 중복 호출 방지).
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

  if (programLoading || !program) {
    return <LoadingContainer />;
  }

  return (
    <div
      className="mx-auto w-full max-w-[55rem] pb-6 md:pt-5"
      data-program-text={program?.title}
    >
      <BackHeader onClick={() => router.back()} className="mx-5">
        결제하기
      </BackHeader>

      <div className="mx-5">
        <OrderProgramInfo
          progressType={programApplicationData.progressType}
          thumbnail={program?.thumbnail}
          title={program?.title}
          programType={programApplicationData.programType}
          endDate={
            program && 'endDate' in program
              ? program.endDate?.toISOString()
              : undefined
          }
          startDate={
            program && 'startDate' in program
              ? program.startDate?.toISOString()
              : undefined
          }
          accessMethod={
            program && 'accessMethod' in program
              ? program.accessMethod
              : undefined
          }
        />
        {program && 'deadline' in program && program.deadline ? (
          <div className="bg-primary-10 text-xsmall14 -mx-5 mb-10 mt-8 flex items-center justify-center gap-2 px-2.5 py-5 lg:mx-0 lg:rounded-sm">
            <span>마감까지</span>
            <Duration
              deadline={program.deadline}
              numberBoxClassName="text-xsmall14 bg-white text-primary"
            />
            <span>남았어요!</span>
          </div>
        ) : (
          <div className="mt-10"></div>
        )}
        <p className="text-xsmall16 text-neutral-0 my-3 font-semibold">
          신청 폼을 모두 입력해주세요.
        </p>
        <div className="flex flex-col gap-2.5">
          <UserInputSection
            userInfo={userInfo}
            contactEmail={programApplicationData.contactEmail ?? ''}
            setContactEmail={(contactEmail) =>
              setProgramApplicationForm({ contactEmail })
            }
          />

          {programApplicationData.programType === 'live' && (
            <MotiveAnswerSection
              userInfo={userInfo}
              setUserInfo={setUserInfo}
            />
          )}
        </div>
      </div>

      <hr className="bg-neutral-95 my-10 block h-2 border-none" />

      {!programApplicationData.isFree && (
        <div className="mx-5 mb-10 flex flex-col gap-y-6">
          <div className="text-neutral-0 font-semibold">결제 정보</div>
          <div className="flex flex-col gap-y-5">
            {showCouponSection && (
              <CouponSection
                setCoupon={setCoupon}
                programType={programApplicationData.programType ?? 'live'}
                maxAmount={maxCouponAmount}
                // [LC-3219-MEMBERSHIP] 시즌 종료 시 이 줄을 지운다. 담당자 임성빈
                allowFullDiscount={!isMembership}
              />
            )}

            <hr className="bg-neutral-85" />

            {programApplicationData.programType === 'challenge' &&
              !isLoading && (
                <div className="text-primary flex items-start gap-2.5 px-3">
                  <CreditCardIcon className="h-auto w-5" />
                  <p className="text-xsmall14 font-medium">
                    {banks.join(', ')}카드로 결제하면{' '}
                    <span className="font-bold">{months}개월 무이자</span> 혜택
                  </p>
                </div>
              )}

            <PriceSection
              payInfo={{
                price: programApplicationData.price ?? 0,
                discount: programApplicationData.discount ?? 0,
              }}
              coupon={{
                id: programApplicationData.couponId
                  ? Number(programApplicationData.couponId)
                  : null,
                price: programApplicationData.couponPrice ?? 0,
              }}
              showCouponDiscount={showCouponSection}
            />
            <hr className="bg-neutral-85" />
            <div className="text-neutral-0 flex h-10 items-center justify-between px-3 font-semibold">
              <span>결제금액</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
          </div>
          {/* [TODO] 제목 포함 조건 지워야 함 */}
          {!isLoading &&
            programApplicationData.programType === 'challenge' &&
            programApplicationData.deposit > 0 && (
              <div className="text-xsmall14 relative overflow-hidden rounded-sm bg-[#E8F9F2] px-4 py-6 md:px-5">
                <p className="font-medium">
                  모든 미션을 성공하면
                  <br className="md:hidden" />{' '}
                  <span className="text-secondary-dark">
                    {programApplicationData.deposit / 10000}만원 페이백
                  </span>{' '}
                  해드려요!
                </p>
                <img
                  className="absolute -right-2 -top-0.5 h-auto w-[130px] md:right-5 md:w-[102px]"
                  src="/images/payback.svg"
                  alt=""
                  aria-hidden="true"
                />
              </div>
            )}
        </div>
      )}

      <PaymentSubmitSection
        onSubmit={onPaymentClick}
        buttonText={buttonText}
        disabled={!isFormValid}
      />
    </div>
  );
};

const PaymentInputPage = () => {
  return (
    <AsyncBoundary pendingFallback={<LoadingContainer />}>
      <PaymentInputContent />
    </AsyncBoundary>
  );
};

export default PaymentInputPage;
