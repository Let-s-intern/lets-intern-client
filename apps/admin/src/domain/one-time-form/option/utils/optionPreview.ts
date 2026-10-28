import type { OptionGroupDraft } from '../types/optionGroupDraft';

/**
 * 신청 화면(U1)에 보일 그룹. 숨긴 옵션은 빼고, 노출 옵션이 하나도 없는 그룹은 통째로 뺀다.
 */
export const getVisibleOptionGroups = (
  groups: OptionGroupDraft[],
): OptionGroupDraft[] =>
  groups
    .map((group) => ({
      ...group,
      options: group.options.filter((option) => option.isVisible),
    }))
    .filter((group) => group.options.length > 0);

/** 노출 옵션 중 추가 금액이 있는 것이 있으면 상품 카드 금액이 "N원부터" 가 된다 */
export const hasVisibleAdditionalPrice = (groups: OptionGroupDraft[]) =>
  groups.some((group) =>
    group.options.some(
      (option) => option.isVisible && option.additionalPrice > 0,
    ),
  );

export const formatAdditionalPrice = (price: number) =>
  price > 0 ? `+${price.toLocaleString()}원` : '추가 금액 없음';
