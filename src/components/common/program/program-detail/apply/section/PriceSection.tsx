import { useCallback, useMemo } from 'react';
import { PayInfo } from '../../section/ApplySection';

interface PriceSectionProps {
  payInfo: PayInfo;
}

interface DiscountResult {
  couponDiscount: number;
  discountPer: number;
}

const handleCouponPrice = (payInfo: PayInfo): DiscountResult => {
  let totalDiscount = payInfo.discount + payInfo.couponPrice;
  let couponDiscount = payInfo.couponPrice;
  if (payInfo.price < totalDiscount) {
    totalDiscount = payInfo.price;
    couponDiscount = payInfo.price - payInfo.discount;
  }
  const discountPer =
    payInfo.price === 0 ? 0 : (totalDiscount / payInfo.price) * 100;
  return { couponDiscount, discountPer };
};

const PriceSection = ({ payInfo }: PriceSectionProps) => {
  const discountInfo = handleCouponPrice(payInfo);

  return (
    <div className="flex flex-col gap-3">
      <div className="font-semibold text-neutral-0">결제 금액</div>
      <div>
        <div className="flex items-center justify-between px-1.5 py-2.5 text-neutral-0">
          <span>참여 비용</span>
          <span>{payInfo.price.toLocaleString()}원</span>
        </div>
        <div className="flex items-center justify-between px-1.5 py-2.5 font-semibold text-primary">
          <span>쿠폰 할인</span>
          <span>-{discountInfo.couponDiscount}원</span>
        </div>
        <div className="flex items-center justify-between px-1.5 py-2.5 font-semibold text-system-error">
          <span>할인 {Math.round(discountInfo.discountPer)}%</span>
          <span>-{payInfo.discount.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
