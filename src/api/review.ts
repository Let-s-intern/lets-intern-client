import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { mypageApplicationsSchema } from './application';

export const getAllApplicationsForReviewQueryKey = ['applications', 'review'];

export const useGetAllApplicationsForReviewQuery = () => {
  return useQuery({
    queryKey: getAllApplicationsForReviewQueryKey,
    queryFn: async () => {
      const res = await axios.get('/user/review/applications');
      return mypageApplicationsSchema.parse(res.data.data).applicationList;
    },
  });
};
