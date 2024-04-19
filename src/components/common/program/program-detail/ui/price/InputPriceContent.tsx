import clsx from 'clsx';
import { calculateProgramPrice } from '../../../../../../utils/programPrice';
import CouponSubmit from './CouponSubmit';
import PriceView from './PriceView';

interface InputPriceContentProps {
  program: {
    type: string;
    feeType: string;
    feeCharge: number;
    feeRefund: number;
    discountValue: number;
  };
  couponDiscount: number;
  setCouponDiscount: (couponDiscount: number) => void;
  formData: any;
  setFormData: (formData: any) => void;
  isLoggedIn: boolean;
  className?: string;
}

const InputPriceContent = ({
  program,
  couponDiscount,
  setCouponDiscount,
  formData,
  setFormData,
  isLoggedIn,
  className,
}: InputPriceContentProps) => {
  const { price, discountAmount, totalPrice } = calculateProgramPrice({
    feeType: program.feeType,
    feeCharge: program.feeCharge,
    feeRefund: program.feeRefund,
    programDiscount: program.discountValue,
    couponDiscount,
  });

  return (
    <>
      {program.feeType !== 'FREE' && price !== 0 && (
        <div className={clsx(className)}>
          {isLoggedIn && (
            <CouponSubmit
              className="mt-3"
              formData={formData}
              setCouponDiscount={setCouponDiscount}
              setFormData={setFormData}
              price={price}
              programDiscount={program.discountValue}
              programType={program.type}
            />
          )}
          <hr className="my-3" />
          <PriceView
            className="mb-5"
            price={price}
            discountAmount={discountAmount}
            couponDiscount={couponDiscount}
            totalPrice={totalPrice}
          />
        </div>
      )}
    </>
  );
};

export default InputPriceContent;
