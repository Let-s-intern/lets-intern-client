import { useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';

import { PayInfo, ProgramDate } from '../../section/ApplySection';
import CouponSection from '../section/CouponSection';
import PayInfoSection from '../section/PayInfoSection';
import PriceSection from '../section/PriceSection';

type Coupon = {
  id: number;
  price: number;
};

interface PayContentProps {
  payInfo: PayInfo;
  coupon: Coupon;
  setCoupon: (coupon: ((prevCoupon: Coupon) => Coupon) | Coupon) => void;
  handleApplyButtonClick: () => void;
  contentIndex: number;
  setContentIndex: (contentIndex: number) => void;
  programType: string;
  totalPrice: number;
  programDate: ProgramDate;
}

const PayContent = ({
  payInfo,
  coupon,
  setCoupon,
  handleApplyButtonClick,
  contentIndex,
  setContentIndex,
  programType,
  totalPrice,
  programDate,
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
              <PayInfoSection payInfo={payInfo} programDate={programDate} />
              <hr className="bg-neutral-85" />
              <CouponSection setCoupon={setCoupon} programType={programType} />
              <hr className="bg-neutral-85" />
              <PriceSection payInfo={payInfo} coupon={coupon} />
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
          결제하기 {totalPrice.toLocaleString()}원
        </button>
      </div>
    </div>
  );
};

export default PayContent;
