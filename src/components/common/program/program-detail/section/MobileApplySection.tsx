import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useProgramApplicationQuery } from '../../../../../api/application';
import { useProgramQuery } from '../../../../../api/program';
import { getPaymentSearchParams } from '../../../../../data/getPaymentSearchParams';
import useRunOnce from '../../../../../hooks/useRunOnce';
import { ProgramType } from '../../../../../types/common';
import {
  IApplyDrawerAction,
  ICouponForm,
} from '../../../../../types/interface';
import {
  generateRandomNumber,
  generateRandomString,
} from '../../../../../utils/random';
import InputContent from '../apply/content/InputContent';
import PayContent from '../apply/content/PayContent';
import ScheduleContent from '../apply/content/ScheduleContent';
import { getPayInfo, UserInfo } from './ApplySection';

interface MobileApplySectionProps {
  programType: ProgramType;
  programId: number;
  programTitle: string;
  toggleDrawer: () => void;
  dispatchDrawerIsOpen: (value: IApplyDrawerAction) => void;
}

const MobileApplySection = ({
  programType,
  programId,
  programTitle,
  toggleDrawer,
  dispatchDrawerIsOpen: drawerDispatch,
}: MobileApplySectionProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contentIndex, setContentIndex] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phoneNumber: '',
    contactEmail: '',
    question: '',
    initialized: false,
  });

  const [coupon, setCoupon] = useState<ICouponForm>({
    id: null,
    price: 0,
  });

  const { data: application } = useProgramApplicationQuery(
    programType,
    programId,
  );

  // searchParams 에 관련 정보가 있을 때 초기 세팅해주고 값 없애기
  useRunOnce(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const contentIndex = searchParams.get('contentIndex');
    const couponId = searchParams.get('couponId');
    const couponPrice = searchParams.get('couponPrice');
    const contactEmail = searchParams.get('contactEmail');
    const question = searchParams.get('question');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const name = searchParams.get('name');

    if (
      typeof contactEmail === 'string' &&
      typeof question === 'string' &&
      typeof email === 'string' &&
      typeof phone === 'string' &&
      typeof name === 'string'
    ) {
      // initialize 무시한다 (우선수위 높음)
      setUserInfo({
        name,
        email,
        phoneNumber: phone,
        contactEmail,
        question,
        initialized: true,
      });
    }

    if (contentIndex === 'pay') {
      setContentIndex(3);
    }

    if (couponId && couponPrice) {
      setCoupon({
        id: Number(couponId),
        price: Number(couponPrice),
      });
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('contentIndex');
    newSearchParams.delete('couponId');
    newSearchParams.delete('couponPrice');
    newSearchParams.delete('contactEmail');
    newSearchParams.delete('question');
    newSearchParams.delete('email');
    newSearchParams.delete('phone');
    newSearchParams.delete('name');

    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${newSearchParams.toString()}`,
    );
  });

  /** application으로부터 user 정보 초기화 */
  useEffect(() => {
    if (!application) {
      return;
    }

    setUserInfo((prev) => {
      if (prev.initialized) {
        return prev;
      }

      return {
        name: application.name ?? '',
        email: application.email ?? '',
        phoneNumber: application.phoneNumber ?? '',
        contactEmail: application.contactEmail ?? '',
        question: '',
        initialized: true,
      };
    });
  }, [application]);

  const isApplied = application?.applied ?? false;

  const priceId =
    application?.priceList?.[0]?.priceId ?? application?.price?.priceId ?? -1;

  const orderId = 'lets' + generateRandomString() + generateRandomNumber();

  const program = useProgramQuery({ programId, type: programType });

  const progressType =
    program.query.data &&
    'progressType' in program.query.data &&
    program.query.data.progressType
      ? program.query.data.progressType
      : 'none';

  const programDate =
    program && program.query.data
      ? {
          beginning: program.query.data.beginning,
          deadline: program.query.data.deadline,
          startDate: program.query.data.startDate,
          endDate: program.query.data.endDate,
        }
      : null;

  const payInfo = application ? getPayInfo(application) : null;

  const totalPrice = useMemo(() => {
    if (!payInfo) {
      return 0;
    }
    const totalDiscount =
      coupon.price === -1 ? payInfo.price : payInfo.discount + coupon.price;
    if (payInfo.price <= totalDiscount) {
      return 0;
    }
    return payInfo.price - totalDiscount;
  }, [coupon, payInfo]);

  const handleApplyButtonClick = (isFree: boolean) => {
    if (!payInfo || !userInfo) {
      return;
    }

    const searchParams = getPaymentSearchParams({
      payInfo,
      coupon,
      userInfo,
      priceId,
      totalPrice,
      programTitle,
      programType,
      progressType,
      programId,
      orderId,
      isFree,
    });

    if (isFree) {
      navigate(`/order/${orderId}/result?${searchParams.toString()}`);
    } else {
      navigate(`/payment?${searchParams.toString()}`);
    }

    toggleDrawer();
    return;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [contentIndex, scrollRef]);

  return (
    <div
      className={twMerge(
        'fixed bottom-0 left-0 right-0 z-30 flex max-h-[80%] w-screen flex-col items-center overflow-hidden rounded-t-lg bg-static-100 shadow-05 scrollbar-hide',
      )}
    >
      <div className="sticky top-0 flex w-full justify-center bg-static-100 py-3">
        <div
          onClick={() =>
            drawerDispatch({
              type: 'close',
            })
          }
          className="h-[5px] w-[70px] shrink-0 cursor-pointer rounded-full bg-neutral-80"
        />
      </div>
      <section
        className={twMerge(
          'h-full w-full overflow-y-auto px-5 pb-3 scrollbar-hide',
        )}
        ref={scrollRef}
      >
        {contentIndex === 0 && programDate ? (
          <ScheduleContent
            contentIndex={contentIndex}
            setContentIndex={setContentIndex}
            programDate={programDate}
            programType={programType}
            programTitle={programTitle}
            isApplied={isApplied}
          />
        ) : null}
        {contentIndex === 1 && (
          <InputContent
            contentIndex={contentIndex}
            setContentIndex={setContentIndex}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            programType={programType}
            drawerDispatch={drawerDispatch}
          />
        )}
        {/* {contentIndex === 2 && (
        <CautionContent
          contentIndex={contentIndex}
          criticalNotice={criticalNotice}
          setContentIndex={setContentIndex}
          isCautionChecked={isCautionChecked}
          setIsCautionChecked={setIsCautionChecked}
        />
      )} */}
        {contentIndex === 3 && programDate && payInfo ? (
          <PayContent
            payInfo={payInfo}
            userInfo={userInfo}
            coupon={coupon}
            setCoupon={setCoupon}
            handleApplyButtonClick={handleApplyButtonClick}
            contentIndex={contentIndex}
            setContentIndex={setContentIndex}
            programType={programType}
            progressType={progressType}
            totalPrice={totalPrice}
            programDate={programDate}
            programQuery={program}
            programId={programId}
          />
        ) : null}
      </section>
    </div>
  );
};

export default MobileApplySection;
