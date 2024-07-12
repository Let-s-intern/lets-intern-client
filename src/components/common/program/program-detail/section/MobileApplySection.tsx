import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IAction } from '../../../../../interfaces/interface';
import { ProgramType } from '../../../../../pages/common/program/ProgramDetail';
import axios from '../../../../../utils/axios';
import CautionContent from '../apply/content/CautionContent';
import InputContent from '../apply/content/InputContent';
import PayContent from '../apply/content/PayContent';
import ScheduleContent from '../apply/content/ScheduleContent';
import { PayInfo, ProgramDate, UserInfo } from './ApplySection';

interface MobileApplySectionProps {
  programType: ProgramType;
  programId: number;
  programTitle: string;
  toggleApplyModal: () => void;
  toggleDrawer: () => void;
  drawerDispatch: (value: IAction) => void;
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  payInfo: PayInfo;
  setPayInfo: (payInfo: (prevPayInfo: PayInfo) => PayInfo) => void;
  criticalNotice: string;
  priceId: number;
  programDate: ProgramDate;
  isApplied: boolean;
  setIsApplied: (isApplied: boolean) => void;
  isCautionChecked: boolean;
  setIsCautionChecked: (isCautionChecked: boolean) => void;
  contentIndex: number;
  setContentIndex: (contentIndex: number) => void;
  totalPrice: number;
}

const MobileApplySection = ({
  programType,
  programId,
  programTitle,
  toggleApplyModal,
  toggleDrawer,
  drawerDispatch,
  userInfo,
  setUserInfo,
  payInfo,
  setPayInfo,
  criticalNotice,
  priceId,
  programDate,
  isApplied,
  setIsApplied,
  isCautionChecked,
  setIsCautionChecked,
  contentIndex,
  setContentIndex,
  totalPrice,
}: MobileApplySectionProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

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
      setIsApplied(true);
      toggleApplyModal();
    },
    onError: (error) => {
      alert('신청에 실패했습니다. 다시 시도해주세요.');
      setContentIndex(0);
    },
  });

  // const handleApplyButtonClick = () => {
  //   applyProgram.mutate();
  //   toggleDrawer();
  //   toggleApplyModal();
  // };

  const handleApplyButtonClick = () => {
    if (isTest) {
      navigate(`/program/${programType}/${programId}/payment`, {
        state: {
          priceId: priceId,
          couponId: payInfo.couponId,
          price: payInfo.price,
          discount: payInfo.discount,
          couponPrice: payInfo.couponPrice,
          totalPrice: totalPrice,
          contactEmail: userInfo.contactEmail,
          question: userInfo.question,
          email: userInfo.email,
          phone: userInfo.phoneNumber,
          name: userInfo.name,
          programTitle: programTitle,
        },
      });
      return;
    }

    applyProgram.mutate();
    toggleDrawer();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [contentIndex, scrollRef]);

  const isTest = userInfo?.email === 'test@test.com';

  return (
    <section
      className="h-full w-full overflow-y-auto scrollbar-hide"
      ref={scrollRef}
    >
      {contentIndex === 0 && (
        <ScheduleContent
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          programDate={programDate}
          programType={programType}
          programTitle={programTitle}
          isApplied={isApplied}
        />
      )}
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
      {contentIndex === 2 && (
        <CautionContent
          contentIndex={contentIndex}
          criticalNotice={criticalNotice}
          setContentIndex={setContentIndex}
          isCautionChecked={isCautionChecked}
          setIsCautionChecked={setIsCautionChecked}
        />
      )}
      {contentIndex === 3 && (
        <PayContent
          payInfo={payInfo}
          setPayInfo={setPayInfo}
          handleApplyButtonClick={handleApplyButtonClick}
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          programType={programType}
          totalPrice={totalPrice}
          isTest={isTest}
          programDate={programDate}
        />
      )}
    </section>
  );
};

export default MobileApplySection;
