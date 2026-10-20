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
  membershipDiscount = 0,
}: {
  payInfo: {
    price: number;
    discount: number;
  };
  coupon: ICouponForm;
  showCouponDiscount?: boolean;
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
