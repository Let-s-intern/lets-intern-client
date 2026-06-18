import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import {
  CardPromotionSchema,
  paymentDetailType,
  paymentListType,
} from './paymentSchema';

export const UsePaymentQueryKey = 'usePaymentQueryKey';

export const paymentListQueryOptions = {
  queryKey: [UsePaymentQueryKey],
  queryFn: async () => {
    const res = await axios.get(`/payment`);
    return paymentListType.parse(res.data.data);
  },
};

export const UsePaymentDetailQueryKey = 'usePaymentDetailQueryKey';

export const paymentDetailQueryOptions = (paymentId: string | number) => ({
  queryKey: [UsePaymentDetailQueryKey, paymentId],
  queryFn: async () => {
    const res = await axios.get(`/payment/${paymentId}`);
    return paymentDetailType.parse(res.data.data);
  },
});

export const usePaymentDetailQuery = (
  paymentId: string | number | undefined | null,
) => {
  return useQuery({
    ...paymentDetailQueryOptions(paymentId ?? ''),
    enabled: !!paymentId,
  });
};

export const useGetTossCardPromotion = () => {
  return useQuery({
    queryKey: ['tossCardPromotion'],
    queryFn: async () => {
      const res = await axios.get('/pg/promotions/card');
      return CardPromotionSchema.parse(res.data.data);
    },
  });
};
