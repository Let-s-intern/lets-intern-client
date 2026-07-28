import { useQuery } from '@tanstack/react-query';

import axios from '@/utils/axios';

export interface CouponItem {
  couponId: number;
  couponType: 'PARTNERSHIP' | 'EVENT' | 'GRADE';
  couponProgramTypeList: string[];
  name: string;
  code: string;
  discount: number;
  time: number;
  remainTime: number;
  startDate: string;
  endDate: string;
}

export const COUPON_TYPE_LABEL: Record<CouponItem['couponType'], string> = {
  PARTNERSHIP: '제휴',
  EVENT: '이벤트',
  GRADE: '등급별 할인',
};

export function useMyCoupons(programType: string = 'ALL') {
  const type = programType.toUpperCase();
  return useQuery({
    queryKey: ['coupon', 'my', type],
    queryFn: async (): Promise<CouponItem[]> => {
      const res = await axios.get('/coupon/my', {
        params: { programType: type },
      });
      return res.data.data.couponList;
    },
  });
}
