import { IPageable } from '@/types/interface';
import axiosV2 from '@/utils/axiosV2';
import { useQuery } from '@tanstack/react-query';
import {
  adminChallengeMentorListSchema,
  adminUserMentorList,
} from './mentorSchema';

/** GET 챌린지 멘토 목록 조회 /api/v2/admin/challenge/{challengeId}/mentor */
export const useAdminChallengeMentorListQuery = (
  challengeId?: string | number,
) => {
  return useQuery({
    queryKey: ['useAdminChallengeMentorsQuery'],
    queryFn: async () => {
      const res = await axiosV2.get(`/admin/challenge/${challengeId}/mentor`);
      return adminChallengeMentorListSchema.parse(res.data.data);
    },
    enabled: !!challengeId,
    refetchOnWindowFocus: false,
  });
};

/** GET 멘토 전체 목록 /api/v2/admin/user/mentor */
export const useAdminUserMentorListQuery = (pageable?: IPageable) => {
  return useQuery({
    queryKey: ['useAdminUserMentorListQuery', pageable],
    queryFn: async () => {
      const res = await axiosV2.get('/admin/user/mentor', {
        params: {
          ...pageable,
        },
      });
      return adminUserMentorList.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};
