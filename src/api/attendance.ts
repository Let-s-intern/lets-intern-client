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

/** 0회차 미션 제출 /api/v1/attendance/{missionId} */
export const useSubmitZeroMission = () => {
  return useMutation({
    mutationFn: async (missionId: number) => {
      const requestBody = {
        link: 'https://example.com', // 임시 링크
        review: '0회차 미션 제출 완료', // 임시 리뷰
      };
      return axios.post(`/attendance/${missionId}`, requestBody);
    },
    onError: (error) => console.error('useSubmitZeroMission >>', error),
  });
};
