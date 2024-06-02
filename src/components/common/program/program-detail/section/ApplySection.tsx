import { useState } from 'react';

import OverviewContent from '../apply/content/OverviewContent';
import InputContent from '../apply/content/InputContent';
import ChoicePayPlanContent from '../apply/content/ChoicePayPlanContent';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../../../../../utils/axios';
import { ProgramType } from '../../../../../pages/common/program/ProgramDetail';
import PayContent from '../apply/content/PayContent';

interface ApplySectionProps {
  programType: ProgramType;
  programId: number;
}

export interface ProgramDate {
  deadline: string;
  startDate: string;
  endDate: string;
}

export interface UserInfo {
  name: string;
  email: string;
  phoneNumber: string;
  motivate: string;
  question: string;
}

const ApplySection = ({ programType, programId }: ApplySectionProps) => {
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
    motivate: '',
    question: '',
  });
  const [priceId, setPriceId] = useState<number>(0);

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
        ...userInfo,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
      });
      if (programType === 'challenge') {
        setPriceId(data.priceList[0].priceId);
      } else {
        setPriceId(data.price.priceId);
      }
      return res.data;
    },
  });

  const applyProgram = useMutation({
    mutationFn: async () => {
      await axios.patch('/user', {
        name: userInfo.name,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
      });
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
    onSuccess: () => {
      setContentIndex(0);
    },
  });

  const handleApplyButtonClick = () => {
    applyProgram.mutate();
  };

  return (
    <section className="sticky top-[7rem] w-[22rem] rounded-lg px-5 py-6 shadow-03">
      {contentIndex === 0 && (
        <OverviewContent
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          programDate={programDate}
          programType={programType}
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
        <PayContent handleApplyButtonClick={handleApplyButtonClick} />
      )}
    </section>
  );
};

export default ApplySection;
