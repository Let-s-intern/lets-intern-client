/* eslint-disable no-console */

import axios from '@/utils/axios';
import axiosV2 from '@/utils/axiosV2';
import { useMutation } from '@tanstack/react-query';
import { PatchMissionReq } from './missionSchema';

/** PATCH [어드민] 미션 수정 /api/v1/mission/{missionId} */
export const usePatchMission = () => {
  return useMutation({
    mutationFn: async (req: PatchMissionReq) => {
      const { missionId, ...body } = req;
      await axios.patch(`/mission/${missionId}`, body);
    },
    onError(error) {
      console.error(error);
      alert('미션 수정에 실패했습니다: ' + error);
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
    onError(error) {
      console.error(error);
      alert('블로그 보너스 제출에 실패했습니다: ' + error);
    },
  });
};
