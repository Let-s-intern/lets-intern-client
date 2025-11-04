import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { userExperienceFiltersSchema } from './userExperienceSchema';

/** React Query 훅 - 필터 옵션 조회 */
export const useUserExperienceFiltersQuery = () => {
  return useQuery({
    queryKey: ['userExperienceFilters'],
    queryFn: async () => {
      const res = await axios.get('/user-experience/filters');
      return userExperienceFiltersSchema.parse(res.data.data);
    },
  });
};

/** React Query 훅 - 경험 데이터 검색 */
