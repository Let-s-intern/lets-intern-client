/* eslint-disable no-console */

import axios from '@/utils/axios';
import { useMutation } from '@tanstack/react-query';
import { PatchAttendanceReq } from './attendanceSchema';

/** 출석 업데이트 /api/v1/attendance/{attendanceId} */
export const usePatchAttendance = () => {
  return useMutation({
    mutationFn: async (req: PatchAttendanceReq) => {
      const { attendanceId, ...body } = req;
      return axios.patch(`/attendance/${attendanceId}`, body);
    },
    onError: (error) => console.error('usePatchAttendance >>', error),
  });
};

/** 출석 생성 /api/v1/attendance/{missionId} */
export const useSubmitMission = () => {
  return useMutation({
    mutationFn: async ({
      missionId,
      link,
      review,
    }: {
      missionId: number;
      link: string;
      review: string;
    }) => {
      return axios.post(`/attendance/${missionId}`, { link, review });
    },
    onError: (error) => console.error('useSubmitZeroMission >>', error),
  });
};

/** n회차 미션 수정 /api/v1/attendance/{missionId} */
export const usePatchMission = () => {
  return useMutation({
    mutationFn: async ({
      missionId,
      link,
      review,
    }: {
      missionId: number;
      link: string;
      review: string;
    }) => {
      return axios.patch(`/attendance/${missionId}`, { link, review });
    },
    onError: (error) => console.error('usePatchMission >>', error),
  });
};
