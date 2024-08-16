import { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ProgramApplicationFormInfo,
  useProgramApplicationQuery,
} from '../../../../../api/application';
import { useProgramQuery } from '../../../../../api/program';
import useRunOnce from '../../../../../hooks/useRunOnce';
import { AccountType } from '../../../../../schema';
import useProgramStore from '../../../../../store/useProgramStore';
import { ProgramType } from '../../../../../types/common';
import { ICouponForm } from '../../../../../types/interface';
import {
  generateRandomNumber,
  generateRandomString,
} from '../../../../../utils/random';
import ChoicePayPlanContent from '../apply/content/ChoicePayPlanContent';
import InputContent from '../apply/content/InputContent';
import OverviewContent from '../apply/content/OverviewContent';
import PayContent from '../apply/content/PayContent';

export interface ProgramDate {
  deadline: Dayjs | null;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  beginning: Dayjs | null;
}

export interface UserInfo {
  name: string;
  email: string;
  phoneNumber: string;
  contactEmail: string;
  question: string;
  initialized?: boolean;
}

export interface PayInfo {
  priceId: number;
  price: number;
  discount: number;
  accountNumber: string;
  deadline: string;
  accountType?: AccountType | null;
  challengePriceType: string | undefined;
  livePriceType: string | undefined;
}

interface ApplySectionProps {
  programType: ProgramType;
  programId: number;
  programTitle: string;
}

// TODO: 다른 곳으로 옮기기
export const getPayInfo = (
  application: ProgramApplicationFormInfo,
): null | {
  priceId: number;
  price: number;
  discount: number;
  accountNumber: string;
  deadline: string;
  accountType?: AccountType | null;
  challengePriceType: string | undefined;
  livePriceType: string | undefined;
} => {
  const item = application.priceList?.[0];
  if (item) {
    return {
      priceId: item.priceId ? item.priceId : -1,
      price: item.price ? item.price : 0,
      discount: item.discount ? item.discount : 0,
      accountNumber: item.accountNumber ? item.accountNumber : '',
      deadline: item.deadline ? item.deadline : '',
      accountType: item.accountType ? item.accountType : null,
      challengePriceType: item.challengePriceType,
      livePriceType: undefined,
    };
  }

  if (application.price) {
    return {
      priceId: application.price.priceId ? application.price.priceId : -1,
      price: application.price.price ? application.price.price : 0,
      discount: application.price.discount ? application.price.discount : 0,
      accountNumber: application.price.accountNumber ?? '',
      deadline: application.price.deadline ?? '',
      accountType: application.price.accountType,
      challengePriceType: undefined,
      livePriceType: application.price.livePriceType,
    };
  }

  return null;
};

const ApplySection = ({
  programType,
  programId,
  programTitle,
}: ApplySectionProps) => {
  const navigate = useNavigate();
  const { data: programApplicationForm, setProgramApplicationForm } =
    useProgramStore();
  const [contentIndex, setContentIndex] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phoneNumber: '',
    contactEmail: '',
    question: '',
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
    const couponId = programApplicationForm.couponId;
    const couponPrice = programApplicationForm.couponPrice;
    const contactEmail = programApplicationForm.contactEmail;
    const question = programApplicationForm.question;
    const email = programApplicationForm.email;
    const phone = programApplicationForm.phone;
    const name = programApplicationForm.name;

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
      setContentIndex(4);
    }

    if (couponId && couponPrice) {
      setCoupon({
        id: Number(couponId),
        price: Number(couponPrice),
      });
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('contentIndex');

    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${newSearchParams.toString()}`,
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

  const progressType =
    program.query.data &&
    'progressType' in program.query.data &&
    program.query.data.progressType
      ? program.query.data.progressType
      : 'none';

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
    setProgramApplicationForm({
      priceId,
      price: payInfo.price,
      discount: payInfo.discount,
      couponId: coupon.id,
      couponPrice: coupon.price,
      totalPrice,
      contactEmail: userInfo.contactEmail,
      question: userInfo.question,
      email: userInfo.email,
      phone: userInfo.phoneNumber,
      name: userInfo.name,
      programTitle,
      programType,
      progressType,
      programId,
      programOrderId: orderId,
      isFree,
    });

    if (isFree) {
      navigate(`/order/result?orderId=${orderId}`);
      return;
    } else {
      navigate(`/payment`);
      return;
    }
  };

  return (
    <section
      className={`sticky top-[7rem] max-h-[calc(100vh-11.75rem)] w-[22rem] overflow-y-auto rounded-lg px-5 py-6 shadow-03 scrollbar-hide`}
    >
      {contentIndex === 0 && programDate ? (
        <OverviewContent
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          programDate={programDate}
          programType={programType}
          programTitle={programTitle}
          isApplied={isApplied}
        />
      ) : null}
      {contentIndex === 1 ? (
        <ChoicePayPlanContent
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
        />
      ) : null}
      {contentIndex === 2 ? (
        <InputContent
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          programType={programType}
        />
      ) : null}
      {contentIndex === 4 && payInfo && programDate ? (
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
  );
};

export default ApplySection;
