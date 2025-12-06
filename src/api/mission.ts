/* eslint-disable no-console */

import axios from '@/utils/axios';
import axiosV2 from '@/utils/axiosV2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PatchMissionReq, PostDocumentReq } from './missionSchema';

interface ErrorResponse {
  message: string;
}

/** PATCH [어드민] 미션 수정 /api/v1/mission/{missionId} */
export const usePatchMission = () => {
  return useMutation({
    mutationFn: async (req: PatchMissionReq) => {
      const { missionId, ...body } = req;
      await axios.patch(`/mission/${missionId}`, body);
    },
    onError(error: AxiosError<ErrorResponse>) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        '알 수 없는 오류가 발생했습니다.';
      alert('미션 수정에 실패했습니다: ' + errorMessage);
    },
  });
};

/** POST [유저] 블로그 보너스 미션 제출 */
export const useSubmitMissionBlogBonus = () => {
  return useMutation({
    mutationFn: async ({
      missionId,
      url,
      accountType,
      accountNum,
    }: {
      missionId: number;
      url: string;
      accountType: string;
      accountNum: string;
    }) => {
      const res = await axiosV2.post(`/review/blog/bonus`, {
        missionId,
        url,
        accountType,
        accountNum,
      });
      return res.data;
    },
    onError(error: AxiosError<ErrorResponse>) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        '알 수 없는 오류가 발생했습니다.';
      alert('블로그 보너스 제출에 실패했습니다: ' + errorMessage);
    },
  });
};

/** POST [유저] 서류 제출 /api/v1/user-document */
export const usePostDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: PostDocumentReq) => {
      const res = await axios.post(`/user-document`, req);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetUserDocumentListQueryKey'],
      });
    },
  });
};

// 수정 필요
/** POST [유저] 인재풀 미션 출석 생성 /api/v1/attendance/pool/{missionId} */
export const usePostTalentPoolAttendanceMutation = () => {
  return useMutation({
    mutationFn: async ({
      missionId,
      req,
    }: {
      missionId: number;
      req: FormData;
    }) => {
      await axios.post(`/attendance/pool/${missionId}`, req, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onError(error: AxiosError<ErrorResponse>) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        '알 수 없는 오류가 발생했습니다.';
      alert('인재풀 제출에 실패했습니다: ' + errorMessage);
    },
  });
};
