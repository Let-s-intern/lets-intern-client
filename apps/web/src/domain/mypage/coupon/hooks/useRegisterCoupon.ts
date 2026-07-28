import axios from '@/utils/axios';
import { ApiError } from '@letscareer/api';
import { useToast } from '@letscareer/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const ERROR_MESSAGES: Record<string, string> = {
  COUPON_NOT_FOUND: '존재하지 않는 쿠폰 코드입니다.',
  COUPON_NOT_AVAILABLE_DATE: '사용 가능 기간이 아닌 쿠폰입니다.',
  COUPON_NOT_AVAILABLE_TIME: '사용 횟수가 초과된 쿠폰입니다.',
  COUPON_NOT_AVAILABLE_ISSUE_TARGET: '쿠폰 사용 대상이 아닙니다.',
  COUPON_ALREADY_REGISTERED: '이미 등록된 쿠폰입니다.',
};

export function useRegisterCoupon(onSuccess: () => void) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: register, isPending } = useMutation({
    mutationFn: async (code: string) => {
      const res = await axios.post('/coupon/my', { code });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupon', 'my'] });
      toast.success('쿠폰이 등록되었습니다');
      onSuccess();
    },
    onError: (error) => {
      const errorCode = (error as ApiError).code;
      setErrorMessage(ERROR_MESSAGES[errorCode] ?? '쿠폰 등록에 실패했습니다.');
    },
  });

  const clearError = () => setErrorMessage(null);

  return { register, isPending, errorMessage, clearError };
}
