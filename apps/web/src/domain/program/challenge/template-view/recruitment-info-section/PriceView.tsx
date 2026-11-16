const PriceView = ({
  originalPrice,
  discountAmount,
}: {
  originalPrice: number;
  discountAmount: number;
}) => {
  const hasDiscount = discountAmount > 0;
  const sellingPrice = originalPrice - discountAmount;
  const percent = hasDiscount
    ? ((discountAmount / originalPrice) * 100).toFixed(0)
    : null;

  return (
    <div className="mt-5 flex shrink-0 flex-col text-left md:mt-0 md:items-end md:text-right">
      {hasDiscount && percent && (
        <span className="inline-flex gap-1 text-xsmall14">
          <span className="font-semibold text-system-error/90">{percent}%</span>
          <span className="font-medium text-neutral-40 line-through">
            {originalPrice.toLocaleString()}원
          </span>
        </span>
      )}

      <span className="text-medium20 font-bold text-neutral-0">
        {sellingPrice.toLocaleString()}원
      </span>
    </div>
  );
};

export default PriceView;
