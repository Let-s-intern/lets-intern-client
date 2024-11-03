import { useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import {
  CardPromotionSchema,
  paymentDetailType,
  paymentListType,
} from './paymentSchema';

export const UsePaymentQueryKey = 'usePaymentQueryKey';

export const usePaymentQuery = () => {
  return useQuery({
    queryKey: [UsePaymentQueryKey],
    queryFn: async () => {
      const res = await axios.get(`/payment`);
      return paymentListType.parse(res.data.data);
    },
  });
};

export const UsePaymentDetailQueryKey = 'usePaymentDetailQueryKey';

export const usePaymentDetailQuery = (paymentId: string | undefined) => {
  return useQuery({
    queryKey: [UsePaymentDetailQueryKey, paymentId],
    queryFn: async () => {
      const res = await axios.get(`/payment/${paymentId}`);
      return paymentDetailType.parse(res.data.data);
    },
    enabled: !!paymentId,
  });
};

const clientKey = import.meta.env.VITE_TOSS_SECRET_KEY || '';
const base64Key = btoa(`${clientKey}:`);

export const useGetTossCardPromotion = () => {
  return useQuery({
    queryKey: ['tossCardPromotion'],
    queryFn: async () => {
      const res = await axios.get(`/v1/promotions/card`, {
        baseURL: 'https://api.tosspayments.com',
        headers: {
          Authorization: `Basic ${base64Key}`,
        },
      });
      return CardPromotionSchema.parse(res.data);
    },
  });
};
