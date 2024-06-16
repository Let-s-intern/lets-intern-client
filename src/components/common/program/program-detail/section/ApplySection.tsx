import { useState } from 'react';

import OverviewContent from '../apply/content/OverviewContent';
import InputContent from '../apply/content/InputContent';
import ChoicePayPlanContent from '../apply/content/ChoicePayPlanContent';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../../../../../utils/axios';
import { ProgramType } from '../../../../../pages/common/program/ProgramDetail';
import PayContent from '../apply/content/PayContent';
import CautionContent from '../apply/content/CautionContent';

export interface ProgramDate {
  deadline: string;
  startDate: string;
  endDate: string;
}

export interface UserInfo {
  name: string;
  email: string;
  phoneNumber: string;
  contactEmail: string;
  motivate: string;
  question: string;
}

export interface PayInfo {
  priceId: number;
  price: number;
  discount: number;
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
  });
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phoneNumber: '',
    contactEmail: '',
    motivate: '',
    question: '',
  });
  const [priceId, setPriceId] = useState<number>(0);
  const [payInfo, setPayInfo] = useState<PayInfo>({
    priceId: 0,
    price: 0,
    discount: 0,
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
      setProgramDate({
        deadline: data.deadline,
        startDate: data.startDate,
        endDate: data.endDate,
      });
      setUserInfo({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        contactEmail: data.contactEmail,
        motivate: '',
        question: '',
      });
      setIsApplied(data.applied);
      if (programType === 'challenge') {
        setPriceId(data.priceList[0].priceId);
        setPayInfo(data.priceList[0]);
      } else {
        setPriceId(data.price.priceId);
        setPayInfo(data.price);
      }
      return res.data;
    },
  });

  const applyProgram = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `/application/${programId}`,
        {
          paymentInfo: {
            priceId: priceId,
            couponId: 0,
          },
          motivate: userInfo.motivate,
          question: userInfo.question,
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
      setContentIndex(0);
    },
  });

  const handleApplyButtonClick = () => {
    applyProgram.mutate();
    toggleApplyModal();
  };

  return (
    <section className="sticky top-[7rem] w-[22rem] rounded-lg px-5 py-6 shadow-03">
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
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          isCautionChecked={isCautionChecked}
          setIsCautionChecked={setIsCautionChecked}
        />
      )}
      {contentIndex === 4 && (
        <PayContent
          payInfo={payInfo}
          handleApplyButtonClick={handleApplyButtonClick}
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
        />
      )}
    </section>
  );
};

export default ApplySection;
