import { useEffect, useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';

import { PayInfo } from '../../section/ApplySection';
import ScrollableBox from '../scrollable-box/ScrollableBox';
import CouponSection from '../section/CouponSection';
import PayInfoSection from '../section/PayInfoSection';
import PriceSection from '../section/PriceSection';

interface ScrollableDiv extends HTMLDivElement {
  scrollTimeout?: number;
}

interface PayContentProps {
  payInfo: PayInfo;
  setPayInfo: (payInfo: (prevPayInfo: PayInfo) => PayInfo) => void;
  handleApplyButtonClick: () => void;
  contentIndex: number;
  setContentIndex: (contentIndex: number) => void;
  programType: string;
}

const PayContent = ({
  payInfo,
  setPayInfo,
  handleApplyButtonClick,
  contentIndex,
  setContentIndex,
  programType,
}: PayContentProps) => {
  const scrollableBoxRef = useRef<ScrollableDiv>(null);

  const handleBackButtonClick = () => {
    if (programType === 'live') {
      setContentIndex(contentIndex - 2);
      return;
    }

    setContentIndex(contentIndex - 1);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableBoxRef.current) {
        scrollableBoxRef.current.classList.add('scrolling');
        clearTimeout(scrollableBoxRef.current.scrollTimeout);
        scrollableBoxRef.current.scrollTimeout = setTimeout(() => {
          if (scrollableBoxRef.current) {
            scrollableBoxRef.current.classList.remove('scrolling');
          }
        }, 500) as unknown as number;
      }
    };

    const scrollableElement = scrollableBoxRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollableBoxRef]);

  const totalPrice = () => {
    const totalDiscount =
      payInfo.couponPrice === -1
        ? payInfo.price
        : payInfo.discount + payInfo.couponPrice;
    if (payInfo.price <= totalDiscount) return 0;
    else return payInfo.price - totalDiscount;
  };

  return (
    <div className="flex flex-col gap-6">
      <ScrollableBox
        ref={scrollableBoxRef}
        className="flex h-full flex-col gap-6"
      >
        {payInfo.challengePriceType !== 'FREE' &&
          payInfo.livePriceType !== 'FREE' && (
            <>
              <h2 className="font-medium">결제 정보</h2>
              <PayInfoSection payInfo={payInfo} />
              <hr className="bg-neutral-85" />
              <CouponSection
                setPayInfo={setPayInfo}
                programType={programType}
              />
              <hr className="bg-neutral-85" />
              <PriceSection payInfo={payInfo} />
            </>
          )}
      </ScrollableBox>
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
          신청하기 {totalPrice().toLocaleString()}원
        </button>
      </div>
    </div>
  );
};

export default PayContent;
