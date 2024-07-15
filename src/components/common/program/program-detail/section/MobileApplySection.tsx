import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgramApplicationQuery } from '../../../../../api/application';
import { useProgramQuery } from '../../../../../api/program';
import { getPaymentSearchParams } from '../../../../../data/getPaymentSearchParams';
import { ProgramType } from '../../../../../types/common';
import {
  IApplyDrawerAction,
  ICouponForm,
} from '../../../../../types/interface';
import InputContent from '../apply/content/InputContent';
import PayContent from '../apply/content/PayContent';
import ScheduleContent from '../apply/content/ScheduleContent';
import { getPayInfo, UserInfo } from './ApplySection';

interface MobileApplySectionProps {
  programType: ProgramType;
  programId: number;
  programTitle: string;
  toggleDrawer: () => void;
  drawerDispatch: (value: IApplyDrawerAction) => void;
}

const MobileApplySection = ({
  programType,
  programId,
  programTitle,
  toggleDrawer,
  drawerDispatch,
}: MobileApplySectionProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
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
    toggleDrawer();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [contentIndex, scrollRef]);

  return (
    <section
      className="h-full w-full overflow-y-auto scrollbar-hide"
      ref={scrollRef}
    >
      {contentIndex === 0 && programDate ? (
        <ScheduleContent
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          programDate={programDate}
          programType={programType}
          programTitle={programTitle}
          isApplied={isApplied}
        />
      ) : null}
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
      {/* {contentIndex === 2 && (
        <CautionContent
          contentIndex={contentIndex}
          criticalNotice={criticalNotice}
          setContentIndex={setContentIndex}
          isCautionChecked={isCautionChecked}
          setIsCautionChecked={setIsCautionChecked}
        />
      )} */}
      {contentIndex === 3 && programDate && payInfo ? (
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
          programQuery={program}
          programId={programId}
        />
      ) : null}
    </section>
  );
};

export default MobileApplySection;
