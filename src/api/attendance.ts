/* eslint-disable no-console */

import axios from '@/utils/axios';
import { useMutation } from '@tanstack/react-query';
import { PatchAttendanceReq } from './attendanceSchema';

/** 출석 업데이트 /api/v1/attendance/{attendanceId} */
export const usePatchAttendance = () => {
  return useMutation({
    mutationFn: async (req: PatchAttendanceReq) => {
      const { attendanceId, ...body } = req;
      return axios.post(`/attendance/${attendanceId}`, body);
    },
    onError: (error) => console.error('usePatchAttendance >>', error),
  });
};
