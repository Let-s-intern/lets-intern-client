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
        <span className="text-xsmall14 inline-flex gap-1">
          <span className="text-system-error/90 font-semibold">{percent}%</span>
          <span className="text-neutral-40 font-medium line-through">
            {originalPrice.toLocaleString()}원
          </span>
        </span>
      )}

      <span className="text-medium20 text-neutral-0 font-bold">
        {sellingPrice.toLocaleString()}원
      </span>
    </div>
  );
};

export default PriceView;
