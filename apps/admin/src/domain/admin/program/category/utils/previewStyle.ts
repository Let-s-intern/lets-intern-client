import type { ProgramCategoryDisplayType } from '../programCategoryApi';

/**
 * 자동이면 상품 유형으로 카드 모양을 정한다. 한 유형뿐일 때만 그 유형 모양을 쓴다
 * (웹 category-landing/landingCard.ts 의 getSectionKind 와 같은 기준)
 */
export const resolveStyle = (
  displayType: ProgramCategoryDisplayType,
  items: { targetType?: string }[],
): Exclude<ProgramCategoryDisplayType, 'AUTO'> => {
  if (displayType !== 'AUTO') return displayType;
  const types = new Set(items.map((t) => t.targetType));
  if (types.size === 1) {
    if (types.has('CHALLENGE')) return 'FEATURED';
    if (types.has('LIVE_MENTORING')) return 'MENTOR';
    if (types.has('BLOG')) return 'BLOG';
  }
  return 'CARDS';
};
