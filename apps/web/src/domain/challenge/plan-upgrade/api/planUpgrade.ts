import { mypageApplicationsQueryOptions } from '@/api/application';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ConfirmPlanUpgradeReq,
  confirmPlanUpgradeResSchema,
  planUpgradeSchema,
} from './planUpgradeSchema';

export const usePlanUpgradeQueryKey = 'usePlanUpgradeQueryKey';

/** GET /api/v1/plan-upgrade/{applicationId} 셀프 업그레이드 조회 */
export const usePlanUpgradeQuery = (applicationId: number | string) => {
  return useQuery({
    queryKey: [usePlanUpgradeQueryKey, applicationId],
    queryFn: async () => {
      const res = await axios.get(`/plan-upgrade/${applicationId}`);
      return planUpgradeSchema.parse(res.data.data);
    },
  });
};

/** POST /api/v1/plan-upgrade/{applicationId}/confirm 토스 승인 후 플랜 변경 */
export const useConfirmPlanUpgradeMutation = (
  applicationId: number | string,
) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (body: ConfirmPlanUpgradeReq) => {
      const res = await axios.post(
        `/plan-upgrade/${applicationId}/confirm`,
        body,
      );
      return confirmPlanUpgradeResSchema.parse(res.data.data);
    },
    onSuccess: () => {
      // URL 의 문자열 id 와 숫자 id 가 섞여도 빠지지 않게 접두어로 무효화한다
      client.invalidateQueries({ queryKey: [usePlanUpgradeQueryKey] });
      client.invalidateQueries({
        queryKey: mypageApplicationsQueryOptions.queryKey,
      });
    },
  });
};
