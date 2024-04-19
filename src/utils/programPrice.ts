import { feeTypeToText } from './convert';

export const calculateProgramPrice = ({
  feeType,
  feeCharge,
  feeRefund,
  programDiscount,
  couponDiscount,
}: {
  feeType: keyof typeof feeTypeToText;
  feeCharge: number;
  feeRefund: number;
  programDiscount: number;
  couponDiscount: number;
}) => {
  const price =
    feeType === 'REFUND'
      ? feeCharge + feeRefund
      : feeType === 'CHARGE'
      ? feeCharge
      : 0;
  const discountAmount = programDiscount;
  const totalPrice =
    price - discountAmount - couponDiscount < 0
      ? 0
      : price - discountAmount - couponDiscount;

  return { price, discountAmount, totalPrice };
};
