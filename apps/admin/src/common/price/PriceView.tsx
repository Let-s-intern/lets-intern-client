import { memo } from 'react';

interface Props {
  price?: number | null;
  discount?: number | null;
}

function PriceView(props: Props) {
  const price = props.price ?? 0;
  const discount = props.discount ?? 0;
  const percent = ((discount / price) * 100).toFixed(0);
  const discountedPrice = price - discount;
  const hasDiscount = discount > 0;

  return (
    <div className="flex shrink-0 flex-col items-end">
      {hasDiscount && (
        <span className="text-xxsmall12 inline-flex gap-1 font-medium leading-none">
          <span className="text-system-error/90">{percent}%</span>
          <span className="text-neutral-50 line-through">
            {price.toLocaleString()}원
          </span>
        </span>
      )}

      <span className="text-xsmall14 text-neutral-10 font-bold">
        {discountedPrice.toLocaleString()}원
      </span>
    </div>
  );
}

export default memo(PriceView);
