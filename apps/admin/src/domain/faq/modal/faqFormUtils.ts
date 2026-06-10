export const FIXED_CATEGORIES = ['진행 방식', '신청/환불', '페이백', '기타'];
export const DIRECT_INPUT = '직접입력';

export const getCategoryOptions = (customCategories: string[]) => [
  ...FIXED_CATEGORIES,
  ...customCategories.filter((c) => c !== DIRECT_INPUT),
  DIRECT_INPUT,
];

export const getIsDuplicateCategory = (
  category: string,
  directInput: string,
  customCategories: string[],
) =>
  category === DIRECT_INPUT &&
  [...FIXED_CATEGORIES, ...customCategories].includes(directInput.trim());
