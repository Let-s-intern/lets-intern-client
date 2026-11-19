import type { ProgramCategoryDisplayType } from '../programCategoryApi';

/** 섹션 카드 모양은 운영자에게 둘만 보인다. 저장 값 AUTO·MENTOR·BLOG 는 "카드 목록" 으로 보인다 */
export type CardStyle = 'FEATURED' | 'CARDS';

export const CARD_STYLE_LABEL: Record<CardStyle, string> = {
  FEATURED: '대표 상품 1개 (가로형)',
  CARDS: '카드 목록',
};

/** 웹 FeaturedChallenge·TargetCards 가 실제로 그리는 모양 그대로 적는다 */
export const CARD_STYLE_DESCRIPTION: Record<CardStyle, string> = {
  FEATURED:
    '첫 번째 상품 하나만 가로형 큰 카드로 보여줍니다. 왼쪽 썸네일, 오른쪽에 제목·설명·신청가·진행기간·신청하기 버튼. 나머지 상품은 보이지 않습니다.',
  CARDS:
    '작은 카드(썸네일·유형·제목·진행기간)를 가로로 나열합니다. 처음 5장이 보이고 나머지는 더보기로 펼칩니다.',
};

export const cardStyleOf = (
  displayType?: ProgramCategoryDisplayType | null,
): CardStyle => (displayType === 'FEATURED' ? 'FEATURED' : 'CARDS');
