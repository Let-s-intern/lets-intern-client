import type { OneTimeFormOptionGroup } from '@/api/one-time-form/oneTimeFormSchema';

// 계약 5.4(선택 규칙), 6.2(옵션 순서), 7절(합계 = basePrice + 고른 옵션 additionalPrice 합).
// 그룹·옵션 순서는 U1 응답 배열 순서를 그대로 쓴다.

/** 고른 옵션 id 를 그룹 순서, 그룹 안 옵션 순서로 정렬해 돌려준다. 폼에 없는 id 는 버린다 */
export const orderSelectedOptionIds = (
  optionGroups: OneTimeFormOptionGroup[],
  selectedOptionIds: number[],
): number[] => {
  const selected = new Set(selectedOptionIds);
  return optionGroups.flatMap((group) =>
    group.options
      .filter((option) => selected.has(option.optionId))
      .map((option) => option.optionId),
  );
};

/** 합계 = 기본 금액 + 고른 옵션 추가 금액 합 */
export const calculateTotalPrice = (
  basePrice: number,
  optionGroups: OneTimeFormOptionGroup[],
  selectedOptionIds: number[],
): number => {
  const selected = new Set(selectedOptionIds);
  return optionGroups.reduce(
    (total, group) =>
      group.options.reduce(
        (sum, option) =>
          selected.has(option.optionId) ? sum + option.additionalPrice : sum,
        total,
      ),
    basePrice,
  );
};

/**
 * 옵션 하나를 눌렀을 때의 다음 선택.
 * SINGLE 은 같은 그룹의 기존 선택을 이 옵션으로 바꾸고, MULTIPLE 은 넣거나 뺀다.
 */
export const selectOption = (
  selectedOptionIds: number[],
  group: OneTimeFormOptionGroup,
  optionId: number,
): number[] => {
  if (group.selectType === 'SINGLE') {
    const groupOptionIds = new Set(group.options.map((o) => o.optionId));
    return [
      ...selectedOptionIds.filter((id) => !groupOptionIds.has(id)),
      optionId,
    ];
  }
  return selectedOptionIds.includes(optionId)
    ? selectedOptionIds.filter((id) => id !== optionId)
    : [...selectedOptionIds, optionId];
};

/** 필수인데 덜 고른 그룹 id. SINGLE 은 정확히 1개, MULTIPLE 은 1개 이상이어야 한다 */
export const findMissingRequiredGroupIds = (
  optionGroups: OneTimeFormOptionGroup[],
  selectedOptionIds: number[],
): number[] => {
  const selected = new Set(selectedOptionIds);
  return optionGroups
    .filter((group) => {
      if (!group.isRequired) return false;
      const count = group.options.filter((o) =>
        selected.has(o.optionId),
      ).length;
      return group.selectType === 'SINGLE' ? count !== 1 : count < 1;
    })
    .map((group) => group.optionGroupId);
};

/** 옵션 카드 오른쪽 금액 문구. 0원은 "추가 금액 없음" */
export const formatAdditionalPrice = (additionalPrice: number): string =>
  additionalPrice === 0
    ? '추가 금액 없음'
    : `+${additionalPrice.toLocaleString('ko-KR')}원`;
