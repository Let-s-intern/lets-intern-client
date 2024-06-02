import { useEffect, useRef } from 'react';

import CouponSection from '../section/CouponSection';
import PayInfoSection from '../section/PayInfoSection';
import PriceSection from '../section/PriceSection';
import ScrollableBox from '../scrollable-box/ScrollableBox';

interface ScrollableDiv extends HTMLDivElement {
  scrollTimeout?: number;
}

interface PayContentProps {
  handleApplyButtonClick: () => void;
}

const PayContent = ({ handleApplyButtonClick }: PayContentProps) => {
  const scrollableBoxRef = useRef<ScrollableDiv>(null);

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

  return (
    <div className="flex flex-col gap-6">
      <ScrollableBox
        ref={scrollableBoxRef}
        className="flex max-h-[20rem] flex-col gap-6"
      >
        <h2 className="font-medium">결제 정보</h2>
        <PayInfoSection />
        <hr className="bg-neutral-85" />
        <CouponSection />
        <hr className="bg-neutral-85" />
        <PriceSection />
      </ScrollableBox>
      <button
        className="flex w-full justify-center rounded-md bg-primary px-6 py-3 text-lg font-medium text-neutral-100"
        onClick={handleApplyButtonClick}
      >
        신청하기 40,000원
      </button>
    </div>
  );
};

export default PayContent;
