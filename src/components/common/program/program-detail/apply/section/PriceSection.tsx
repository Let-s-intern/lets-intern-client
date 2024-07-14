import { PayInfo } from '../../section/ApplySection';

interface DiscountResult {
  couponDiscount: number;
  discountPer: number;
  totalDiscount: number;
}

type Coupon = {
  id: number;
  price: number;
};

const handleCouponPrice = ({
  coupon,
  payInfo,
}: {
  payInfo: PayInfo;
  coupon: Coupon;
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
}: {
  payInfo: PayInfo;
  coupon: Coupon;
}) => {
  const discountInfo = handleCouponPrice({ payInfo, coupon });
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
          <span>-{discountInfo.couponDiscount.toLocaleString()}원</span>
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
