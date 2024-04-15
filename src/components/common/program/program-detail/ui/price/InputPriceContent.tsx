import { calculateProgramPrice } from '../../../../../../utils/programPrice';
import CouponSubmit from './CouponSubmit';
import PriceView from './PriceView';

interface InputPriceContentProps {
  programFee: {
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
}

const InputPriceContent = ({
  programFee,
  couponDiscount,
  setCouponDiscount,
  formData,
  setFormData,
  isLoggedIn,
}: InputPriceContentProps) => {
  const { price, discountAmount, totalPrice } = calculateProgramPrice({
    feeType: programFee.feeType,
    feeCharge: programFee.feeCharge,
    feeRefund: programFee.feeRefund,
    programDiscount: programFee.discountValue,
    couponDiscount,
  });

  return (
    <>
      {programFee.feeType !== 'FREE' && price !== 0 && (
        <>
          {isLoggedIn && (
            <CouponSubmit
              className="mt-3"
              formData={formData}
              setCouponDiscount={setCouponDiscount}
              setFormData={setFormData}
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
        </>
      )}
    </>
  );
};

export default InputPriceContent;
