import { useMemo } from 'react';

import { useGetTossCardPromotion } from '@/api/payment/payment';
import { convertCodeToCardKorName } from '@/api/payment/paymentSchema';

export function useInstallmentPayment() {
  const { data, isLoading } = useGetTossCardPromotion();

  const info = useMemo(() => {
    if (!data) return { months: null, banks: [] };

    const allMonths = data.interestFreeCards.flatMap(
      (card) => card.installmentFreeMonths,
    );
    const uniqueMonths = Array.from(new Set(allMonths)).sort((a, b) => b - a);
    const targetMonth = uniqueMonths[1] ?? uniqueMonths[0] ?? null;
    if (!targetMonth) return { months: null, banks: [] };

    // 선택된 개월 수를 제공하는 은행 목록 필터링
    const banks = data.interestFreeCards
      .filter((card) => card.installmentFreeMonths.includes(targetMonth))
      .map((card) => convertCodeToCardKorName[card.issuerCode]);

    return { months: targetMonth, banks };
  }, [data]);

  return { isLoading, ...info };
}
