import { ICouponForm } from '../../../../../types/interface';

interface DiscountResult {
  couponDiscount: number;
  discountPer: number;
  totalDiscount: number;
}

const handleCouponPrice = ({
  coupon,
  payInfo,
}: {
  payInfo: {
    price: number;
    discount: number;
  };
  coupon: ICouponForm;
}): DiscountResult => {
  let totalDiscount =
    payInfo.discount + (coupon.price === -1 ? payInfo.price : coupon.price);
  let couponDiscount = coupon.price === -1 ? payInfo.price : coupon.price;
  if (payInfo.price <= totalDiscount) {
    totalDiscount = payInfo.price;
    couponDiscount = payInfo.price - payInfo.discount;
  }

  // payInfo.discount만 할인율 이용
  const discountPer =
    payInfo.price === 0 || payInfo.discount === 0
      ? 0
      : Math.floor((payInfo.discount / payInfo.price) * 100);

  return { couponDiscount, discountPer, totalDiscount };
};

const PriceSection = ({
  payInfo,
  coupon,
  showCouponDiscount = true,
  vodPassPrice = 0,
  vodPassMonths = 0,
  membershipDiscount = 0,
}: {
  payInfo: {
    price: number;
    discount: number;
  };
  coupon: ICouponForm;
  showCouponDiscount?: boolean;
  /** 함께 결제하는 VOD 이용권 가격. 쿠폰 적용 뒤에 더해지며 0 이면 줄을 그리지 않는다 (LC-3438) */
  vodPassPrice?: number;
  /** 함께 결제하는 VOD 이용권 개월 수. 0 이면 개월 표기 없이 그린다 (LC-3438) */
  vodPassMonths?: number;
  membershipDiscount?: number; // 올인원패스 권한 할인액 (>0일 때만 노출)
}) => {
  const discountInfo = handleCouponPrice({ payInfo, coupon });
  return (
    <div className="flex flex-col">
      <div className="text-neutral-0 flex h-10 items-center justify-between px-3">
        <span>결제상품</span>
        <span>{payInfo.price.toLocaleString()}원</span>
      </div>
      <div className="text-neutral-0 flex h-10 items-center justify-between px-3">
        <span>{Math.round(discountInfo.discountPer)}% 할인</span>
        <span>-{payInfo.discount.toLocaleString()}원</span>
      </div>
      {showCouponDiscount && (
        <div className="text-primary flex h-10 items-center justify-between px-3">
          <span>쿠폰할인</span>
          <span className="font-bold">
            -{discountInfo.couponDiscount.toLocaleString()}원
          </span>
        </div>
      )}
      {vodPassPrice > 0 && (
        <div className="text-neutral-0 flex h-10 items-center justify-between px-3">
          <span>
            VOD 이용권{vodPassMonths > 0 ? ` ${vodPassMonths}개월` : ''}
          </span>
          <span>+{vodPassPrice.toLocaleString()}원</span>
        </div>
      )}
      {membershipDiscount > 0 && (
        <div className="text-primary flex h-10 items-center justify-between px-3">
          <span>패스 혜택 할인</span>
          <span className="font-bold">
            -{membershipDiscount.toLocaleString()}원
          </span>
        </div>
      )}
    </div>
  );
};

export default PriceSection;
