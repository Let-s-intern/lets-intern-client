import clsx from 'clsx';

interface DiscountPercentProps {
  className?: string;
  programFeeType: string;
  discountAmount: number;
  price: number;
}

const DiscountPercent = ({
  className,
  programFeeType,
  discountAmount,
  price,
}: DiscountPercentProps) => {
  return (
    <>
      {programFeeType !== 'FREE' && discountAmount > 0 && price !== 0 && (
        <span className={clsx('text-0.75-semibold text-red-500', className)}>
          {Math.round((discountAmount / price) * 100)}%
        </span>
      )}
    </>
  );
};

export default DiscountPercent;
