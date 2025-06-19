/* eslint-disable no-console */

import axios from '@/utils/axios';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { PatchMissionReq } from './missionSchema';

const client = new QueryClient();

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
    onSuccess() {
      client.invalidateQueries({
        queryKey: ['admin', 'challenge', 'missions'],
      });
    },
  });
};
