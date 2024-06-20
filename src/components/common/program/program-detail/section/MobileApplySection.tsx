import { useReducer, useState } from 'react';

import InputContent from '../apply/content/InputContent';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../../../../../utils/axios';
import { ProgramType } from '../../../../../pages/common/program/ProgramDetail';
import PayContent from '../apply/content/PayContent';
import CautionContent from '../apply/content/CautionContent';
import { PayInfo } from './ApplySection';
import { IAction } from '../../../../../interfaces/interface';

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

interface MobileApplySectionProps {
  programType: ProgramType;
  programId: number;
  toggleApplyModal: () => void;
  toggleDrawer: () => void;
  drawerDispatch: (value: IAction) => void;
}

const MobileApplySection = ({
  programType,
  programId,
  toggleApplyModal,
  toggleDrawer,
  drawerDispatch,
}: MobileApplySectionProps) => {
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
    couponId: 0,
    couponPrice: 0,
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
    onSuccess: () => {
      setContentIndex(1);
    },
  });

  const handleApplyButtonClick = () => {
    applyProgram.mutate();
    toggleDrawer();
    toggleApplyModal();
  };

  return (
    <section className="w-full">
      {contentIndex === 0 && (
        <InputContent
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          programType={programType}
          drawerDispatch={drawerDispatch}
        />
      )}
      {contentIndex === 1 && (
        <CautionContent
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          isCautionChecked={isCautionChecked}
          setIsCautionChecked={setIsCautionChecked}
        />
      )}
      {contentIndex === 2 && (
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

export default MobileApplySection;
