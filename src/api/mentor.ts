/* eslint-disable no-console */

import { IPageable } from '@/types/interface';
import axios from '@/utils/axios';
import axiosV2 from '@/utils/axiosV2';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  adminChallengeMentorListSchema,
  adminUserMentorList,
  PostAdminChallengeMentorReq,
} from './mentorSchema';

/** GET 챌린지 멘토 목록 조회 /api/v2/admin/challenge/{challengeId}/mentor */
export const useAdminChallengeMentorListQuery = (
  challengeId?: string | number,
) => {
  return useQuery({
    queryKey: ['useAdminChallengeMentorsQuery', challengeId],
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

/** POST 챌린지 멘토 등록 /api/v2/admin/challenge/{challengeId}/mentor */
export const usePostAdminChallengeMentor = () => {
  return useMutation({
    mutationFn: async (data: PostAdminChallengeMentorReq) => {
      const { challengeId, ...body } = data;
      await axiosV2.post(`/admin/challenge/${challengeId}/mentor`, body);
    },
    onError: (error) => {
      console.error(error);
      alert('usePostAdminChallengeMentor >> ' + error);
    },
  });
};

/** DELETE 챌린지 멘토 삭제 /api/v1/admin/challenge-mentor/{challengeMentorId} */
export const useDeleteChallengeMentor = () => {
  return useMutation({
    mutationFn: async (challengeMentorId: string | number) => {
      return axios.delete(`/admin/challenge-mentor/${challengeMentorId}`);
    },
    onError: (error) => {
      console.error(error);
      alert('useDeleteChallengeMentor >> ' + error);
    },
  });
};
