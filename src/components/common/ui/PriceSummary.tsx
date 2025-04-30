interface Props {
  wrapperClassName?: string;
  originalPrice: number;
  discountPrice: number;
}

function PriceSummary({
  wrapperClassName,
  originalPrice,
  discountPrice,
}: Props) {
  const finalPrice = originalPrice - discountPrice;
  const discountRate =
    originalPrice === 0
      ? 0
      : ((discountPrice / originalPrice) * 100).toFixed(0);

  return (
    <div className={wrapperClassName}>
      {/* 할인 금액이 0이면 표시 X */}
      {discountPrice !== 0 && (
        <div className="flex items-center gap-1">
          <span className="text-small20 font-bold text-[#FC5555]">
            {discountRate}%
          </span>
          <s className="text-small20 font-bold text-neutral-45">
            {originalPrice.toLocaleString()}원
          </s>
        </div>
      )}
      <span className="text-xlarge28 font-bold">
        {finalPrice.toLocaleString()}원
      </span>
    </div>
  );
}

export default PriceSummary;
