import { ApiError } from '@letscareer/api';
import axios from '@/utils/axios';
import { ICouponForm } from '@/types/interface';
import { useState } from 'react';

const ERROR_MESSAGES: Record<string, string> = {
  COUPON_NOT_FOUND: '존재하지 않는 쿠폰 코드입니다.',
  COUPON_NOT_AVAILABLE_DATE: '사용 기간이 아닌 쿠폰입니다.',
  COUPON_NOT_AVAILABLE_PROGRAM_TYPE: '해당 프로그램에 사용 불가한 쿠폰입니다.',
  COUPON_NOT_AVAILABLE_TIME: '사용 횟수가 초과된 쿠폰입니다.',
  COUPON_NOT_AVAILABLE_ISSUE_TARGET: '쿠폰 사용 대상이 아닙니다.',
};

interface Params {
  programType: string;
  maxAmount: number;
  setCoupon: (coupon: ICouponForm) => void;
}

export function useApplyCoupon({ programType, maxAmount, setCoupon }: Params) {
  const [applyError, setApplyError] = useState<string | null>(null);

  const applyCoupon = async (code: string) => {
    setApplyError(null);
    try {
      const res = await axios.get('/coupon', {
        params: { code, programType: programType.toUpperCase() },
      });
      const { couponId, discount } = res.data.data as {
        couponId: number;
        discount: number;
      };
      setCoupon({
        id: couponId,
        price: discount === -1 ? maxAmount : Math.min(discount, maxAmount),
      });
    } catch (error) {
      const errorCode = (error as ApiError).code;
      setApplyError(ERROR_MESSAGES[errorCode] ?? '쿠폰 적용에 실패했습니다.');
      setCoupon({ id: null, price: 0 });
    }
  };

  return { applyCoupon, applyError };
}
