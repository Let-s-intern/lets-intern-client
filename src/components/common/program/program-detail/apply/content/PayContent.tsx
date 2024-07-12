import { useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';

import { PayInfo } from '../../section/ApplySection';
import CouponSection from '../section/CouponSection';
import PayInfoSection from '../section/PayInfoSection';
import PriceSection from '../section/PriceSection';

interface PayContentProps {
  payInfo: PayInfo;
  setPayInfo: (payInfo: (prevPayInfo: PayInfo) => PayInfo) => void;
  handleApplyButtonClick: () => void;
  contentIndex: number;
  setContentIndex: (contentIndex: number) => void;
  programType: string;
  totalPrice: number;
  // 결제 심사 용도로 만든 임시 결제 페이지인지 여부
  isTest: boolean;
}

const PayContent = ({
  payInfo,
  setPayInfo,
  handleApplyButtonClick,
  contentIndex,
  setContentIndex,
  programType,
  totalPrice,
  isTest,
}: PayContentProps) => {
  const topRef = useRef<HTMLDivElement>(null);

  const handleBackButtonClick = () => {
    if (programType === 'live') {
      setContentIndex(contentIndex - 2);
      return;
    }

    setContentIndex(contentIndex - 1);
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex h-full flex-col gap-6">
        {payInfo.challengePriceType !== 'FREE' &&
          payInfo.livePriceType !== 'FREE' && (
            <>
              <h2 className="font-medium" ref={topRef}>
                결제 정보
              </h2>
              {!isTest && (
                <>
                  <PayInfoSection payInfo={payInfo} />
                  <hr className="bg-neutral-85" />
                </>
              )}
              <CouponSection
                setPayInfo={setPayInfo}
                programType={programType}
              />
              <hr className="bg-neutral-85" />
              <PriceSection payInfo={payInfo} />
            </>
          )}
      </div>
      <div className="flex gap-2">
        <button
          className="flex w-full flex-1 items-center justify-center rounded-md border-2 border-primary bg-neutral-100 px-6 py-3 text-lg font-medium text-primary-dark"
          onClick={handleBackButtonClick}
        >
          <span className="text-[1.25rem]">
            <FaArrowLeft />
          </span>
        </button>
        <button
          className="complete_button text-1.125-medium flex w-full justify-center rounded-md bg-primary px-6 py-3 font-medium text-neutral-100"
          onClick={() => {
            handleApplyButtonClick();
          }}
        >
          {isTest
            ? `결제하기 ${totalPrice.toLocaleString()}원`
            : `신청하기 ${totalPrice.toLocaleString()}원`}
        </button>
      </div>
    </div>
  );
};

export default PayContent;
