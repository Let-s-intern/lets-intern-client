/* eslint-disable no-console */

import axios from '@/utils/axios';
import axiosV2 from '@/utils/axiosV2';
import { useMutation } from '@tanstack/react-query';
import {
  PatchAdminAttendanceReq,
  PatchAttendanceMentorReq,
  PatchAttendanceReq,
} from './attendanceSchema';

/** [유저용] 출석 업데이트 /api/v1/attendance/{attendanceId} */
export const usePatchAttendance = () => {
  return useMutation({
    mutationFn: async (req: PatchAttendanceReq) => {
      const { attendanceId, ...body } = req;
      return axios.patch(`/attendance/${attendanceId}`, body);
    },
    onError: (error) => console.error('usePatchAttendance >>', error),
  });
};

/** [멘토용] 출석 업데이트 /api/v1/attendance/{attendanceId}/mentor */
export const usePatchAttendanceMentor = () => {
  return useMutation({
    mutationFn: async (req: PatchAttendanceMentorReq) => {
      const { attendanceId, ...body } = req;
      return axios.patch(`/attendance/${attendanceId}/mentor`, body);
    },
    onError: (error) => console.error('usePatchAttendanceMentor >>', error),
  });
};

/** [어드민] 출석 업데이트 /api/v2/admin/attendance/{attendanceId} */
export const usePatchAdminAttendance = () => {
  return useMutation({
    mutationFn: async (req: PatchAdminAttendanceReq) => {
      const { attendanceId, ...body } = req;
      return axiosV2.patch(`/admin/attendance/${attendanceId}`, body);
    },
    onError: (error) => console.error('usePatchAdminAttendance >>', error),
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
      link: string | null;
      review: string | null;
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
