import { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProgramType } from '../../../../../pages/common/program/ProgramDetail';
import axios from '../../../../../utils/axios';
import CautionContent from '../apply/content/CautionContent';
import ChoicePayPlanContent from '../apply/content/ChoicePayPlanContent';
import InputContent from '../apply/content/InputContent';
import OverviewContent from '../apply/content/OverviewContent';
import PayContent from '../apply/content/PayContent';

export interface ProgramDate {
  deadline: string;
  startDate: string;
  endDate: string;
  beginning: string;
}

export interface UserInfo {
  name: string;
  email: string;
  phoneNumber: string;
  contactEmail: string;
  question: string;
}

export interface PayInfo {
  priceId: number;
  couponId: null | number;
  price: number;
  discount: number;
  couponPrice: number;
  accountNumber: string;
  deadline: string;
  accountType: string;
  livePriceType: string;
  challengePriceType: string;
}

interface ApplySectionProps {
  programType: ProgramType;
  programId: number;
  programTitle: string;
  toggleApplyModal: () => void;
}

const ApplySection = ({
  programType,
  programId,
  programTitle,
  toggleApplyModal,
}: ApplySectionProps) => {
  const queryClient = useQueryClient();

  const [contentIndex, setContentIndex] = useState(0);
  const [programDate, setProgramDate] = useState<ProgramDate>({
    deadline: '',
    startDate: '',
    endDate: '',
    beginning: '',
  });
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phoneNumber: '',
    contactEmail: '',
    question: '',
  });
  const [criticalNotice, setCriticalNotice] = useState<string>('');
  const [priceId, setPriceId] = useState<number>(0);
  const [payInfo, setPayInfo] = useState<PayInfo>({
    priceId: 0,
    couponId: null,
    price: 0,
    discount: 0,
    couponPrice: 0,
    accountNumber: '',
    deadline: '',
    accountType: '',
    livePriceType: '',
    challengePriceType: '',
  });
  const [isCautionChecked, setIsCautionChecked] = useState<boolean>(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);

  useQuery({
    queryKey: [programType, programId, 'application'],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/application`);
      const data = res.data.data;
      setUserInfo({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        contactEmail: data.contactEmail,
        question: '',
      });
      setCriticalNotice(data.criticalNotice);
      setIsApplied(data.applied);
      if (programType === 'challenge') {
        setPriceId(data.priceList[0].priceId);
        setPayInfo({
          priceId: data.priceList[0].priceId,
          couponId: null,
          price: data.priceList[0].price,
          discount: data.priceList[0].discount,
          couponPrice: 0,
          accountNumber: data.priceList[0].accountNumber,
          deadline: data.priceList[0].deadline,
          accountType: data.priceList[0].accountType,
          livePriceType: data.priceList[0].livePriceType,
          challengePriceType: data.priceList[0].challengePriceType,
        });
      } else {
        setIsCautionChecked(true);
        setPriceId(data.price.priceId);
        setPayInfo({
          priceId: data.price.priceId,
          couponId: null,
          price: data.price.price,
          discount: data.price.discount,
          couponPrice: 0,
          accountNumber: data.price.accountNumber,
          deadline: data.price.deadline,
          accountType: data.price.accountType,
          livePriceType: data.price.livePriceType,
          challengePriceType: data.price.challengePriceType,
        });
      }
      return res.data;
    },
  });

  useQuery({
    queryKey: [programType, programId],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}`);
      const data = res.data.data;
      setProgramDate({
        deadline: data.deadline,
        startDate: data.startDate,
        endDate: data.endDate,
        beginning: data.beginning,
      });
    },
  });

  const applyProgram = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `/application/${programId}`,
        {
          paymentInfo: {
            priceId: priceId,
            couponId: payInfo.couponId,
          },
          question: userInfo.question,
          contactEmail: userInfo.contactEmail,
        },
        {
          params: {
            type: programType.toUpperCase(),
          },
        },
      );
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [programType],
      });
      toggleApplyModal();
      setContentIndex(0);
    },
    onError: (error) => {
      alert('신청에 실패했습니다. 다시 시도해주세요.');
      setContentIndex(0);
    },
  });

  const handleApplyButtonClick = () => {
    applyProgram.mutate();
  };

  return (
    <section
      className={`sticky top-[7rem] max-h-[calc(100vh-11.75rem)] w-[22rem] overflow-y-auto rounded-lg px-5 py-6 shadow-03 scrollbar-hide`}
    >
      {contentIndex === 0 && (
        <OverviewContent
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          programDate={programDate}
          programType={programType}
          programTitle={programTitle}
          isApplied={isApplied}
        />
      )}
      {contentIndex === 1 && (
        <ChoicePayPlanContent
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
        />
      )}
      {contentIndex === 2 && (
        <InputContent
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          programType={programType}
        />
      )}
      {contentIndex === 3 && (
        <CautionContent
          criticalNotice={criticalNotice}
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          isCautionChecked={isCautionChecked}
          setIsCautionChecked={setIsCautionChecked}
        />
      )}
      {contentIndex === 4 && (
        <PayContent
          payInfo={payInfo}
          setPayInfo={setPayInfo}
          handleApplyButtonClick={handleApplyButtonClick}
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          programType={programType}
        />
      )}
    </section>
  );
};

export default ApplySection;
