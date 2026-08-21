'use client';

import { useCallback, useState } from 'react';

/**
 * 쿠폰 코드를 들고만 있는다.
 *
 * **사전 검증을 하지 않는다.** 서버는 신청 생성 시점에 `couponCode` 를 받아
 * `CouponProgramType.LIVE` 로 검증하고 할인 금액을 계산한다. 사전 검증
 * 엔드포인트가 따로 없어서, 여기서 확인하려면 서버에 API 를 새로 파야 한다.
 * 그 대가로 **잘못된 코드가 결제하기를 누르는 순간까지 걸러지지 않는다.**
 *
 * 할인 금액도 서버가 정한다. 화면에서 금액을 미리 빼서 보여줄 근거가 없다 —
 * `PriceSection` 이 숫자 대신 "결제 단계에서 적용" 이라고만 적는 이유다.
 */
export function useLiveMentoringCoupon() {
  const [inputValue, setInputValue] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const register = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed.length === 0) return;
    setAppliedCode(trimmed);
  }, [inputValue]);

  const clear = useCallback(() => {
    setAppliedCode(null);
    setInputValue('');
  }, []);

  return { inputValue, setInputValue, appliedCode, register, clear };
}
