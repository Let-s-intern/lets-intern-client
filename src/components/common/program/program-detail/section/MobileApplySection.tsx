import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgramType } from '../../../../../types/common';
import { IAction } from '../../../../../types/interface';
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
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // const totalPrice = useMemo(() => {
  //   const totalDiscount =
  //     payInfo.couponPrice === -1
  //       ? payInfo.price
  //       : payInfo.discount + payInfo.couponPrice;
  //   if (payInfo.price <= totalDiscount) {
  //     return 0;
  //   }
  //   return payInfo.price - totalDiscount;
  // }, [payInfo.couponPrice, payInfo.discount, payInfo.price]);

  // const handleApplyButtonClick = () => {
  //   const searchParams = getPaymentSearchParams({
  //     payInfo,
  //     coupon,
  //     userInfo,
  //     priceId,
  //     totalPrice,
  //     programTitle,
  //     programType,
  //     programId,
  //   });

  //   navigate(`/payment?${searchParams.toString()}`);
  //   toggleDrawer();
  // };

  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTo(0, 0);
  //   }
  // }, [contentIndex, scrollRef]);

  // return (
  //   <section
  //     className="h-full w-full overflow-y-auto scrollbar-hide"
  //     ref={scrollRef}
  //   >
  //     {contentIndex === 0 && (
  //       <ScheduleContent
  //         contentIndex={contentIndex}
  //         setContentIndex={setContentIndex}
  //         programDate={programDate}
  //         programType={programType}
  //         programTitle={programTitle}
  //         isApplied={isApplied}
  //       />
  //     )}
  //     {contentIndex === 1 && (
  //       <InputContent
  //         contentIndex={contentIndex}
  //         setContentIndex={setContentIndex}
  //         userInfo={userInfo}
  //         setUserInfo={setUserInfo}
  //         programType={programType}
  //         drawerDispatch={drawerDispatch}
  //       />
  //     )}
  //     {contentIndex === 2 && (
  //       <CautionContent
  //         contentIndex={contentIndex}
  //         criticalNotice={criticalNotice}
  //         setContentIndex={setContentIndex}
  //         isCautionChecked={isCautionChecked}
  //         setIsCautionChecked={setIsCautionChecked}
  //       />
  //     )}
  //     {contentIndex === 3 && (
  //       <PayContent
  //         payInfo={payInfo}
  //         setPayInfo={setPayInfo}
  //         handleApplyButtonClick={handleApplyButtonClick}
  //         contentIndex={contentIndex}
  //         setContentIndex={setContentIndex}
  //         programType={programType}
  //         totalPrice={totalPrice}
  //         programDate={programDate}
  //       />
  //     )}
  //   </section>
  // );
  return <div></div>;
};

export default MobileApplySection;
