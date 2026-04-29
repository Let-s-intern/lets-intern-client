import { IPageable } from '@/types/interface';
import axios from '@/utils/axios';
import axiosV2 from '@/utils/axiosV2';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  adminChallengeMentorListSchema,
  adminUserMentorList,
  type PatchAttendanceMentorReq,
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
      // eslint-disable-next-line no-console
      console.error(error);
      alert(`문제가 발생했습니다: ${error}`);
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
      // eslint-disable-next-line no-console
      console.error(error);
      alert(`문제가 발생했습니다: ${error}`);
    },
  });
};

/** POST 멘토-멘티 매칭 (다건) /api/v2/admin/challenge/{challengeId}/mentor/{challengeMentorId}/match */
export const usePostAdminChallengeMentorMatch = () => {
  return useMutation({
    mutationFn: async (data: {
      challengeId: number;
      challengeMentorId: number;
      challengeApplicationIdList: number[];
    }) => {
      const { challengeId, challengeMentorId, challengeApplicationIdList } =
        data;
      await axiosV2.post(
        `/admin/challenge/${challengeId}/mentor/${challengeMentorId}/match`,
        { challengeApplicationIdList },
      );
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      alert(`매칭에 실패했습니다: ${error}`);
    },
  });
};

/** PATCH 멘토 피드백 저장 /api/v1/attendance/{attendanceId}/mentor */
export const usePatchAttendanceMentorMutation = () => {
  return useMutation({
    mutationFn: async (
      data: PatchAttendanceMentorReq & { attendanceId: number },
    ) => {
      const { attendanceId, ...body } = data;
      return axios.patch(`/attendance/${attendanceId}/mentor`, body);
    },
  });
};
