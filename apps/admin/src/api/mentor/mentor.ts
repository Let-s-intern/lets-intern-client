import { IPageable } from '@/types/interface';
import axios from '@/utils/axios';
import axiosV2 from '@/utils/axiosV2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  adminChallengeMentorListSchema,
  adminUserMentorList,
  mentorHashTagListSchema,
  type MentorHashTagReq,
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

export const UseAdminUserMentorListQueryKey = 'useAdminUserMentorListQuery';

/** GET 멘토 전체 목록 /api/v2/admin/user/mentor */
export const useAdminUserMentorListQuery = (pageable?: IPageable) => {
  return useQuery({
    queryKey: [UseAdminUserMentorListQueryKey, pageable],
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

export const AdminMentorHashTagQueryKey = 'adminMentorHashTagListQuery';

/** GET 멘토 해시태그 목록 조회 /api/v1/admin/mentor-hash-tag */
export const useAdminMentorHashTagListQuery = () => {
  return useQuery({
    queryKey: [AdminMentorHashTagQueryKey],
    queryFn: async () => {
      const res = await axios.get('/admin/mentor-hash-tag');
      return mentorHashTagListSchema.parse(res.data).mentorHashTagList;
    },
    refetchOnWindowFocus: false,
  });
};

/** POST 멘토 해시태그 생성 /api/v1/admin/mentor-hash-tag */
export const usePostAdminMentorHashTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: MentorHashTagReq) => {
      const res = await axios.post('/admin/mentor-hash-tag', body);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AdminMentorHashTagQueryKey],
      });
    },
  });
};

/** PATCH 멘토 해시태그 수정 /api/v1/admin/mentor-hash-tag/{mentorHashTagId} */
export const usePatchAdminMentorHashTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      mentorHashTagId,
      ...body
    }: MentorHashTagReq & { mentorHashTagId: number }) => {
      const res = await axios.patch(
        `/admin/mentor-hash-tag/${mentorHashTagId}`,
        body,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AdminMentorHashTagQueryKey],
      });
    },
  });
};

/** DELETE 멘토 해시태그 삭제 /api/v1/admin/mentor-hash-tag/{mentorHashTagId} */
export const useDeleteAdminMentorHashTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mentorHashTagId: number) => {
      return axios.delete(`/admin/mentor-hash-tag/${mentorHashTagId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AdminMentorHashTagQueryKey],
      });
    },
  });
};
