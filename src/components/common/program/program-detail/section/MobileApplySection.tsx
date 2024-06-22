import { useState } from 'react';

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
  const [criticalNotice, setCriticalNotice] = useState<string>('');
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
    couponId: null,
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
          criticalNotice={criticalNotice}
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
