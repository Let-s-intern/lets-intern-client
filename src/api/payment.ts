import { useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import { paymentListType } from './paymentSchema';

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
