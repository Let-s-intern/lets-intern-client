import clsx from 'clsx';
import DiscountPercent from './DiscountPercent';

interface StartPriceContentProps {
  programFee: {
    feeType: string;
    feeCharge: number;
    feeRefund: number;
    discountValue: number;
  };
  topLine?: boolean;
  className?: string;
}

const StartPriceContent = ({
  programFee,
  topLine,
  className,
}: StartPriceContentProps) => {
  const price =
    programFee.feeType === 'REFUND'
      ? programFee.feeCharge + programFee.feeRefund
      : programFee.feeType === 'CHARGE'
      ? programFee.feeCharge
      : 0;
  const discountAmount = programFee.discountValue;

  return (
    <div className={clsx(className)}>
      {topLine && <hr className="my-2" />}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-0.875-semibold">가격</span>
          <DiscountPercent
            className="hidden sm:block"
            programFeeType={programFee.feeType}
            discountAmount={discountAmount}
            price={price}
          />
        </div>
        <div className="flex flex-col items-end sm:flex-row sm:items-center sm:gap-2">
          {programFee.feeType !== 'FREE' &&
            discountAmount > 0 &&
            price !== 0 && (
              <span className="text-0.875-semibold sm:text-1-semibold text-zinc-400 line-through">
                {price.toLocaleString()}원
              </span>
            )}
          <span className="text-1.125-semibold">
            {programFee.feeType === 'FREE' || price === 0 ? (
              <>무료</>
            ) : (
              <div className="flex items-center gap-1">
                <DiscountPercent
                  className="block sm:hidden"
                  programFeeType={programFee.feeType}
                  discountAmount={discountAmount}
                  price={price}
                />
                <span>{(price - discountAmount).toLocaleString()}원</span>
              </div>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StartPriceContent;
