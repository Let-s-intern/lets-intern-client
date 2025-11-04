import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import {
  userExperienceFiltersSchema,
  UserExperienceSearchRequest,
  userExperienceSearchResponseSchema,
} from './userExperienceSchema';

/** GET /api/v1/user-experience/filters - 유저 경험 필터 조회 */
export const fetchUserExperienceFilters = async () => {
  const res = await axios.get('/user-experience/filters');
  return userExperienceFiltersSchema.parse(res.data.data);
};

/** POST /api/v1/user-experience/search - 유저 경험 검색 */
export const searchUserExperiences = async (
  request: UserExperienceSearchRequest,
) => {
  const res = await axios.post('/user-experience/search', request);
  return userExperienceSearchResponseSchema.parse(res.data.data);
};

/** React Query 훅 - 필터 옵션 조회 */
export const useUserExperienceFiltersQuery = () => {
  return useQuery({
    queryKey: ['userExperienceFilters'],
    queryFn: fetchUserExperienceFilters,
  });
};

/** React Query 훅 - 경험 데이터 검색 */
export const useSearchUserExperiencesQuery = (
  request: UserExperienceSearchRequest,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['userExperienceSearch', request],
    queryFn: () => searchUserExperiences(request),
    enabled,
  });
};
