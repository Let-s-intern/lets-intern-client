import { usePatchUser } from '@/api/user';
import { UserInfo } from '@/lib/order';
import useAuthStore from '@/store/useAuthStore';
import CouponSection from '@components/common/program/program-detail/apply/section/CouponSection';
import MotiveAnswerSection from '@components/common/program/program-detail/apply/section/MotiveAnswerSection';
import PriceSection from '@components/common/program/program-detail/apply/section/PriceSection';
import UserInputSection from '@components/common/program/program-detail/apply/section/UserInputSection';
import Header from '@components/common/program/program-detail/header/Header';
import { Duration } from '@components/Duration';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgramQuery } from '../../../api/program';
import useProgramStore from '../../../store/useProgramStore';
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
  if (price <= totalDiscount) {
    return 0;
  }
  return price - totalDiscount;
}

const PaymentInputPage = () => {
  const navigate = useNavigate();
  const {
    data: programApplicationData,
    checkInvalidate,
    setProgramApplicationForm,
    initProgramApplicationForm,
  } = useProgramStore();

  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    console.log('programApplicationData', programApplicationData);
  }, [programApplicationData]);

  useEffect(() => {
    if (checkInvalidate() || !isLoggedIn) {
      console.log(
        '잘못된 접근입니다. programApplicationData',
        programApplicationData,
      );

      alert('잘못된 접근입니다.');
      initProgramApplicationForm();
      navigate('/');
    }
  }, [
    checkInvalidate,
    initProgramApplicationForm,
    isLoggedIn,
    navigate,
    programApplicationData,
  ]);

  const {
    query: { data: program },
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

  const setUserInfo = useCallback(
    (info: UserInfo) => {
      const { contactEmail, email, name, phoneNumber, question } = info;
      setProgramApplicationForm({
        contactEmail,
        email,
        name,
        phone: phoneNumber,
        question,
      });
    },
    [setProgramApplicationForm],
  );

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

  const onPaymentClick = useCallback(async () => {
    try {
      await patchUserMutation.mutateAsync({
        contactEmail: programApplicationData.contactEmail,
      });
      navigate('/payment');
    } catch (e) {
      if (e instanceof AxiosError) {
        alert(e.response?.data?.message);
      }
    }
  }, [navigate, patchUserMutation, programApplicationData.contactEmail]);

  return (
    <div
      className="mx-auto w-full max-w-5xl pb-6"
      data-program-text={program?.title}
    >
      <Header className="mx-5" programTitle="결제하기" />

      <hr className="my-6 block h-2 border-none bg-neutral-95" />

      <div className="mx-5">
        <OrderProgramInfo
          endDate={program?.endDate?.toISOString()}
          progressType={programApplicationData.progressType}
          startDate={program?.startDate?.toISOString()}
          thumbnail={program?.thumbnail}
          title={program?.title}
        />

        <div className="-mx-5 mb-10 mt-8 flex items-center justify-center gap-2 bg-primary-10 px-2.5 py-5 text-xsmall14 lg:rounded-sm">
          <span>마감까지</span>
          {program?.endDate ? (
            <Duration
              deadline={program.endDate}
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
            setUserInfo={setUserInfo}
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
        <div className="mx-5 flex flex-col gap-y-6">
          <div className="font-semibold text-neutral-0">결제 정보</div>
          <div className="flex flex-col gap-y-5">
            <CouponSection
              setCoupon={(coupon) => {
                const data =
                  typeof coupon === 'function'
                    ? coupon({
                        id: programApplicationData.couponId
                          ? Number(programApplicationData.couponId)
                          : null,
                        price: programApplicationData.couponPrice ?? 0,
                      })
                    : coupon;

                setProgramApplicationForm({
                  couponId: String(data.id),
                  couponPrice: data.price,
                  totalPrice: calculateTotalPrice({
                    price: programApplicationData.price ?? 0,
                    discount: programApplicationData.discount ?? 0,
                    couponPrice: data.price,
                  }),
                });
              }}
              programType={programApplicationData.programType ?? 'live'}
            />

            <hr className="bg-neutral-85" />

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
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 block rounded-t-lg bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+10px);] pt-3 shadow-05 sm:hidden">
        <button
          className="next_button flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100 transition hover:opacity-90 disabled:border-neutral-70 disabled:bg-neutral-70"
          onClick={onPaymentClick}
        >
          결제하기
        </button>
      </div>
    </div>
  );
};

export default PaymentInputPage;
