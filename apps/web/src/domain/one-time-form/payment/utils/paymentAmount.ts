import type {
  OneTimeForm,
  OneTimeFormSelectedOption,
} from '@/api/one-time-form/oneTimeFormSchema';
import { calculateTotalPrice } from '../../utils/optionSelection';

export interface PaymentAmountSummary {
  /** 기본 금액 줄 이름. 토스 주문명과 같은 값(계약 11.3) */
  productName: string;
  basePrice: number;
  /** 고른 옵션 줄. 그룹 순서, 그룹 안 옵션 순서 */
  optionLines: OneTimeFormSelectedOption[];
  totalPrice: number;
}

/**
 * 결제 단계 금액 카드. U1 의 현재 금액과 보관한 선택으로 계산한다.
 * 폼에 없는(숨겨졌거나 지워진) 옵션 id 는 줄에서도 합계에서도 뺀다. 서버도 같은 값으로 다시 계산한다(계약 7절).
 */
export const buildPaymentAmountSummary = (
  { form, optionGroups }: OneTimeForm,
  selectedOptionIds: number[],
): PaymentAmountSummary => {
  const selected = new Set(selectedOptionIds);
  const optionLines = optionGroups.flatMap((group) =>
    group.options
      .filter((option) => selected.has(option.optionId))
      .map((option) => ({
        optionGroupId: group.optionGroupId,
        groupTitle: group.title,
        optionId: option.optionId,
        optionName: option.name,
        additionalPrice: option.additionalPrice,
      })),
  );

  return {
    productName: form.paymentProductName ?? form.title,
    basePrice: form.basePrice,
    optionLines,
    totalPrice: calculateTotalPrice(
      form.basePrice,
      optionGroups,
      selectedOptionIds,
    ),
  };
};

export const formatWon = (price: number) =>
  `${price.toLocaleString('ko-KR')}원`;
