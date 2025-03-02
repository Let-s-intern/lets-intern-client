import { useProgramQuery } from '@/api/program';
import { usePatchUser } from '@/api/user';
import CreditCardIcon from '@/assets/icons/credit-card.svg?react';
import PaybackImage from '@/assets/payback.png';
import { useInstallmentPayment } from '@/hooks/useInstallmentPayment';
import { UserInfo } from '@/lib/order';
import useAuthStore from '@/store/useAuthStore';
import useProgramStore, {
  checkInvalidate,
  initProgramApplicationForm,
  setProgramApplicationForm,
} from '@/store/useProgramStore';
import { isValidEmail } from '@/utils/valid';
import CouponSection, {
  CouponSectionProps,
} from '@components/common/program/program-detail/apply/section/CouponSection';
import MotiveAnswerSection from '@components/common/program/program-detail/apply/section/MotiveAnswerSection';
import PriceSection from '@components/common/program/program-detail/apply/section/PriceSection';
import UserInputSection from '@components/common/program/program-detail/apply/section/UserInputSection';
import BackHeader from '@components/common/ui/BackHeader';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { Duration } from '@components/Duration';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderProgramInfo from './OrderProgramInfo';

function calculateTotalPrice({
  price = 0,
  discount = 0,
  couponPrice = 0,
}: {
  price?: number;
  discount?: number;
  couponPrice?: number;
}) {
  const totalDiscount = couponPrice === -1 ? price : discount + couponPrice;
  if (price <= totalDiscount) return 0;
  return price - totalDiscount;
}

const PaymentInputPage = () => {
  const navigate = useNavigate();
  const { data: programApplicationData } = useProgramStore();

  const { isLoggedIn } = useAuthStore();
  const { isLoading, months, banks } = useInstallmentPayment();

  useEffect(() => {
    if (checkInvalidate() || !isLoggedIn) {
      alert('잘못된 접근입니다.');
      navigate('/', { replace: true });
      initProgramApplicationForm();
    }
  }, [isLoggedIn, navigate]);

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

  const totalPrice = useMemo(() => {
    const payInfo = {
      price: programApplicationData.price ?? 0,
      discount: programApplicationData.discount ?? 0,
    };
    const couponPrice = programApplicationData.couponPrice ?? 0;
    const totalDiscount =
      couponPrice === -1 ? payInfo.price : payInfo.discount + couponPrice;
    if (payInfo.price <= totalDiscount) {
      return 0;
    }
    return payInfo.price - totalDiscount;
  }, [
    programApplicationData.couponPrice,
    programApplicationData.discount,
    programApplicationData.price,
  ]);

  const patchUserMutation = usePatchUser();

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
        price: programApplicationData.price ?? 0,
        discount: programApplicationData.discount ?? 0,
        couponPrice: data.price,
      });

      setProgramApplicationForm({
        couponId: String(data.id),
        couponPrice: data.price,
        totalPrice: newTotalPrice,
      });
    },
    [
      programApplicationData.couponId,
      programApplicationData.couponPrice,
      programApplicationData.discount,
      programApplicationData.price,
    ],
  );

  const [allowNavigation, setAllowNavigation] = useState(false);
  const [nextPath, setNextPath] = useState('');

  useEffect(() => {
    // 페이지 이탈 시 실행될 함수
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!allowNavigation) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [allowNavigation]);

  // allowNavigation이 true로 변경되면 navigation 수행
  useEffect(() => {
    if (allowNavigation && nextPath) {
      navigate(nextPath);
      setAllowNavigation(false);
    }
  }, [allowNavigation, nextPath, navigate]);

  const handleSafeNavigation = useCallback((path: string) => {
    setNextPath(path);
    setAllowNavigation(true);
  }, []);

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
      if (e instanceof AxiosError) {
        alert(e.response?.data?.message);
      }
    }
  }, [
    handleSafeNavigation,
    patchUserMutation,
    programApplicationData.contactEmail,
    programApplicationData.programOrderId,
    totalPrice,
  ]);

  /** 쿠폰 적용이 아니라 애초부터 무료인 경우 다르게 보여주기 **/
  const buttonText = programApplicationData.isFree
    ? '0원 결제하기'
    : '결제하기';

  if (programLoading || !program) {
    return <LoadingContainer />;
  }

  return (
    <div
      className="mx-auto w-full max-w-[55rem] pb-6 md:pt-5"
      data-program-text={program?.title}
    >
      <BackHeader onClick={() => navigate(-1)} className="mx-5">
        결제하기
      </BackHeader>

      <div className="mx-5">
        <OrderProgramInfo
          endDate={program?.endDate?.toISOString()}
          progressType={programApplicationData.progressType}
          startDate={program?.startDate?.toISOString()}
          thumbnail={program?.thumbnail}
          title={program?.title}
        />

        <div className="-mx-5 mb-10 mt-8 flex items-center justify-center gap-2 bg-primary-10 px-2.5 py-5 text-xsmall14 lg:mx-0 lg:rounded-sm">
          <span>마감까지</span>
          {program?.deadline ? (
            <Duration
              deadline={program.deadline}
              numberBoxClassName="text-xsmall14 bg-white text-primary"
            />
          ) : null}
          <span>남았어요!</span>
        </div>

        <p className="my-3 text-xsmall16 font-semibold text-neutral-0">
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

      <hr className="my-10 block h-2 border-none bg-neutral-95" />

      {!programApplicationData.isFree && (
        <div className="mx-5 mb-10 flex flex-col gap-y-6">
          <div className="font-semibold text-neutral-0">결제 정보</div>
          <div className="flex flex-col gap-y-5">
            <CouponSection
              setCoupon={setCoupon}
              programType={programApplicationData.programType ?? 'live'}
            />

            <hr className="bg-neutral-85" />

            {programApplicationData.programType === 'challenge' &&
              !isLoading && (
                <div className="flex items-start gap-2.5 px-3 text-primary">
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
            />
            <hr className="bg-neutral-85" />
            <div className="flex h-10 items-center justify-between px-3 font-semibold text-neutral-0">
              <span>결제금액</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
          </div>
          {!programApplicationData.programTitle?.includes('마케팅') &&
            programApplicationData.programType === 'challenge' &&
            !isLoading && (
              <div className="relative rounded-sm bg-[#E8F9F2] px-4 py-6 text-xsmall14 md:px-5">
                <p className="font-medium">
                  모든 미션을 성공하면
                  <br className="md:hidden" />{' '}
                  <span className="text-secondary-dark">3만원 페이백</span>{' '}
                  해드려요!
                </p>
                <img
                  className="absolute bottom-0 right-0 h-full w-auto"
                  src={PaybackImage.src}
                  alt="3만원 페이백"
                />
              </div>
            )}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 block rounded-t-lg bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+10px);] pt-3 shadow-05 md:hidden">
        <button
          className="next_button flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100 transition hover:opacity-90 disabled:border-neutral-70 disabled:bg-neutral-70 hover:disabled:opacity-100"
          onClick={onPaymentClick}
          disabled={
            !userInfo.initialized || !isValidEmail(userInfo.contactEmail)
          }
        >
          {buttonText}
        </button>
      </div>

      <div className="mx-5 hidden md:block">
        <button
          className="next_button block w-full justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100 transition hover:opacity-90 disabled:border-neutral-70 disabled:bg-neutral-70 hover:disabled:opacity-100"
          onClick={onPaymentClick}
          disabled={
            !userInfo.initialized || !isValidEmail(userInfo.contactEmail)
          }
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PaymentInputPage;
