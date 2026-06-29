import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { CardPromotionSchema, paymentListType } from './paymentSchema';

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

export const useGetTossCardPromotion = () => {
  return useQuery({
    queryKey: ['tossCardPromotion'],
    queryFn: async () => {
      const res = await axios.get('/pg/promotions/card');
      return CardPromotionSchema.parse(res.data.data);
    },
  });
};
