import { useQueryClient } from '@tanstack/react-query';
import { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ProgramApplicationFormInfo,
  useProgramApplicationQuery,
} from '../../../../../api/application';
import { useProgramQuery } from '../../../../../api/program';
import { getPaymentSearchParams } from '../../../../../data/getPaymentSearchParams';
import { AccountType } from '../../../../../schema';
import { ProgramType } from '../../../../../types/common';
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
}

// export interface PayInfo {
//   priceId: number;
//   couponId: null | number;
//   price: number;
//   discount: number;
//   couponPrice: number;
//   accountNumber: string;
//   deadline: string;
//   accountType: string;
//   livePriceType: string;
//   challengePriceType: string;
// }
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
  toggleApplyModal: () => void;
}

const getPayInfo = (
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
      priceId: item.priceId,
      price: item.price,
      discount: item.discount,
      accountNumber: item.accountNumber,
      deadline: item.deadline,
      accountType: item.accountType,
      challengePriceType: item.challengePriceType,
      livePriceType: undefined,
    };
  }

  if (application.price) {
    return {
      priceId: application.price.priceId,
      price: application.price.price,
      discount: application.price.discount,
      accountNumber: application.price.accountNumber,
      deadline: application.price.deadline,
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
  toggleApplyModal,
}: ApplySectionProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [contentIndex, setContentIndex] = useState(0);
  // const [programDate, setProgramDate] = useState<ProgramDate>({
  //   deadline: '',
  //   startDate: '',
  //   endDate: '',
  //   beginning: '',
  // });
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phoneNumber: '',
    contactEmail: '',
    question: '',
  });
  // const [criticalNotice, setCriticalNotice] = useState<string>('');
  // const [priceId, setPriceId] = useState<number>(0);
  // const [payInfo, setPayInfo] = useState<PayInfo>({
  //   priceId: 0,
  //   couponId: null,
  //   price: 0,
  //   discount: 0,
  //   couponPrice: 0,
  //   accountNumber: '',
  //   deadline: '',
  //   accountType: '',
  //   livePriceType: '',
  //   challengePriceType: '',
  // });
  const [isCautionChecked, setIsCautionChecked] = useState<boolean>(false);
  // const [isApplied, setIsApplied] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<{
    id: number;
    price: number;
  }>({
    id: -1,
    price: 0,
  });

  const { data: application } = useProgramApplicationQuery(
    programType,
    programId,
  );

  useEffect(() => {
    if (!application) {
      return;
    }

    setUserInfo({
      name: application.name ?? '',
      email: application.email ?? '',
      phoneNumber: application.phoneNumber ?? '',
      contactEmail: application.contactEmail ?? '',
      question: '',
    });
  }, [application]);

  const isApplied = application?.applied ?? false;

  const priceId =
    application?.priceList?.[0]?.priceId ?? application?.price?.priceId ?? -1;
  // const payInfo1234 = useQuery({
  //   queryKey: [programType, programId, 'application'],
  //   queryFn: async () => {
  //     const res = await axios.get(`/${programType}/${programId}/application`);
  //     const data = res.data.data;
  //     // setUserInfo({
  //     //   name: data.name,
  //     //   email: data.email,
  //     //   phoneNumber: data.phoneNumber,
  //     //   contactEmail: data.contactEmail || '',
  //     //   question: '',
  //     // });
  //     // setCriticalNotice(data.criticalNotice);
  //     // setIsApplied(data.applied);
  //     // if (programType === 'challenge') {
  //     //   setPriceId(data.priceList[0].priceId);
  //     //   setPayInfo({
  //     //     priceId: data.priceList[0].priceId,
  //     //     couponId: null,
  //     //     price: data.priceList[0].price,
  //     //     discount: data.priceList[0].discount,
  //     //     couponPrice: 0,
  //     //     accountNumber: data.priceList[0].accountNumber,
  //     //     deadline: data.priceList[0].deadline,
  //     //     accountType: data.priceList[0].accountType,
  //     //     livePriceType: data.priceList[0].livePriceType,
  //     //     challengePriceType: data.priceList[0].challengePriceType,
  //     //   });
  //     // } else {
  //     //   setIsCautionChecked(true);
  //     //   setPriceId(data.price.priceId);
  //     //   setPayInfo({
  //     //     priceId: data.price.priceId,
  //     //     couponId: null,
  //     //     price: data.price.price,
  //     //     discount: data.price.discount,
  //     //     couponPrice: 0,
  //     //     accountNumber: data.price.accountNumber,
  //     //     deadline: data.price.deadline,
  //     //     accountType: data.price.accountType,
  //     //     livePriceType: data.price.livePriceType,
  //     //     challengePriceType: data.price.challengePriceType,
  //     //   });
  //     // }
  //     return res.data;
  //   },
  // });

  // useQuery({
  //   queryKey: [programType, programId],
  //   queryFn: async () => {
  //     const res = await axios.get(`/${programType}/${programId}`);
  //     const data = res.data.data;
  //     setProgramDate({
  //       deadline: data.deadline,
  //       startDate: data.startDate,
  //       endDate: data.endDate,
  //       beginning: data.beginning,
  //     });
  //   },
  // });

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

  const handleApplyButtonClick = () => {
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
      programId,
    });
    navigate(`/payment?${searchParams.toString()}`);
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
      {/* {contentIndex === 3 && (
        <CautionContent
          criticalNotice={criticalNotice}
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          isCautionChecked={isCautionChecked}
          setIsCautionChecked={setIsCautionChecked}
        />
      )} */}
      {contentIndex === 4 && payInfo && programDate ? (
        <PayContent
          payInfo={payInfo}
          coupon={coupon}
          setCoupon={setCoupon}
          handleApplyButtonClick={handleApplyButtonClick}
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          programType={programType}
          totalPrice={totalPrice}
          programDate={programDate}
        />
      ) : null}
    </section>
  );
};

export default ApplySection;
