import clsx from 'clsx';

interface PriceView {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  price: number;
  discountAmount: number;
  couponDiscount: number;
  totalPrice: number;
}

const PriceView = ({
  as: Wrapper = 'div',
  className,
  price,
  discountAmount,
  couponDiscount,
  totalPrice,
}: PriceView) => {
  return (
    <Wrapper className={clsx(className)}>
      <h3 className="font-semibold">결제 금액</h3>
      <div className="mt-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="w-[5.5rem] rounded-full bg-primary py-1 text-center text-xs font-medium text-white">
            참여비용
          </div>
          <span className="font-semibold">{price.toLocaleString()}원</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex items-center justify-between">
            <div className="w-[5.5rem] rounded-full bg-[#BDBDBD] py-1 text-center text-xs font-medium text-white">
              할인금액
            </div>
            <span className="font-semibold text-[#BDBDBD]">
              -{discountAmount.toLocaleString()}원
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="w-[5.5rem] rounded-full bg-amber-500 py-1 text-center text-xs font-medium text-white">
            쿠폰 할인
          </div>
          <span className="font-semibold text-primary">
            -{couponDiscount.toLocaleString()}원
          </span>
        </div>
      </div>
      <hr className="mb-3 mt-5" />
      <div className="flex justify-end">
        <span className="text-xl font-semibold">
          {totalPrice.toLocaleString()}원
        </span>
      </div>
    </Wrapper>
  );
};

export default PriceView;
