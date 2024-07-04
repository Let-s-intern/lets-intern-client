import { useMutation } from '@tanstack/react-query';
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
}: MobileApplySectionProps) => {
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
    onSuccess: () => {
      setIsApplied(true);
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
        />
      )}
    </section>
  );
};

export default MobileApplySection;
