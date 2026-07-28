import { useQuery } from '@tanstack/react-query';

import axios from '@/utils/axios';

import type { ChallengeTypeOption } from './useCouponTargetState';

interface TargetOptions {
  challengeTypeList: ChallengeTypeOption[];
  liveList: { id: number; title: string }[];
}

export function useCouponTargetOptions() {
  return useQuery({
    queryKey: ['coupon', 'admin', 'issue-target-options'],
    queryFn: async (): Promise<TargetOptions> => {
      const res = await axios.get('/coupon/admin/issue-target-options');
      return res.data.data;
    },
  });
}
