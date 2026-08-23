'use client';

import { useCallback, useState } from 'react';

import { applyLiveMentoringCoupon } from '@/api/live-mentoring/liveMentoring';
import { readServerError } from '../../utils/serverError';

const COUPON_ERROR_MESSAGES: Record<string, string> = {
  COUPON_NOT_FOUND: '존재하지 않는 쿠폰 번호입니다.',
  COUPON_NOT_AVAILABLE_DATE: '사용 가능 기간이 아닌 쿠폰입니다.',
  COUPON_NOT_AVAILABLE_TIME: '사용 횟수가 초과된 쿠폰입니다.',
  COUPON_NOT_AVAILABLE_PROGRAM_TYPE: '1대1 라이브 멘토링에 사용할 수 없는 쿠폰입니다.',
  COUPON_NOT_AVAILABLE_ISSUE_TARGET: '쿠폰 사용 대상이 아닙니다.',
};

/**
 * 쿠폰 코드를 등록 시점에 서버로 검증하고 할인 금액을 받아 온다.
 *
 * `GET /api/v1/coupon?code=&programType=LIVE_MENTORING` 이 신청 생성과 **같은**
 * 검증(`couponService.applyCoupon`)을 태우므로, 여기서 통과한 쿠폰은 결제에서도 통과한다.
 * 등록만 해두고 결제하기에서 처음 걸러지면 사용자는 무엇이 잘못됐는지 알 수 없고
 * 할인 금액도 끝까지 보이지 않는다.
 *
 * 최종 금액은 여전히 서버가 정한다. 여기서 받은 `discount` 는 표시용이고,
 * 신청 생성 응답의 `finalAmount` 가 실제 결제 금액이다.
 */
export function useLiveMentoringCoupon() {
  const [inputValue, setInputValue] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const register = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (trimmed.length === 0) return;

    setIsValidating(true);
    setErrorMessage(null);
    try {
      const applied = await applyLiveMentoringCoupon(trimmed);
      setAppliedCode(trimmed);
      setDiscount(applied.discount);
    } catch (error) {
      const { code, message } = readServerError(
        error,
        '쿠폰을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.',
      );
      setErrorMessage(
        (code && COUPON_ERROR_MESSAGES[code]) || message,
      );
      setAppliedCode(null);
      setDiscount(null);
    } finally {
      setIsValidating(false);
    }
  }, [inputValue]);

  const clear = useCallback(() => {
    setAppliedCode(null);
    setDiscount(null);
    setErrorMessage(null);
    setInputValue('');
  }, []);

  return {
    inputValue,
    setInputValue,
    appliedCode,
    discount,
    errorMessage,
    isValidating,
    register,
    clear,
  };
}
