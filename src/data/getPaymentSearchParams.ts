import { z } from 'zod';
import { PayInfo } from '../components/common/program/program-detail/section/ApplySection';

export const getPaymentSearchParams = ({
  payInfo,
  coupon,
  userInfo,
  priceId,
  totalPrice,
  programTitle,
  programType,
  programId,
}: {
  payInfo: PayInfo;
  coupon: { id: number; price: number } | null;
  userInfo: {
    contactEmail: string;
    question: string;
    email?: string | null;
    phoneNumber?: string | null;
    name: string;
  };
  priceId: number;
  totalPrice: number;
  programTitle: string;
  programType: string;
  programId: number;
}): URLSearchParams => {
  const result = new URLSearchParams();
  result.set('priceId', priceId.toString());
  result.set('couponId', coupon ? coupon.id.toString() : '');
  result.set('price', payInfo.price.toString());
  result.set('discount', payInfo.discount.toString());
  result.set('couponPrice', coupon ? coupon.price.toString() : '0');
  result.set('totalPrice', totalPrice.toString());
  result.set('contactEmail', userInfo.contactEmail);
  result.set('question', userInfo.question);
  result.set('email', userInfo.email ?? '');
  result.set('phone', userInfo.phoneNumber ?? '');
  result.set('name', userInfo.name);
  result.set('programTitle', programTitle);
  result.set('programType', programType);
  result.set('programId', programId.toString());
  return result;
};

export const paymentSearchParamsSchema = z.object({
  priceId: z.coerce.number(),
  couponId: z.union([z.literal(''), z.coerce.number()]),
  price: z.coerce.number(),
  discount: z.coerce.number(),
  couponPrice: z.coerce.number(),
  totalPrice: z.coerce.number(),
  contactEmail: z.string(),
  question: z.string(),
  email: z.string(),
  phone: z.string(),
  name: z.string(),
  programTitle: z.string(),
  programType: z.string(),
  programId: z.coerce.number(),
});
