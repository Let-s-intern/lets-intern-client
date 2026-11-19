import type { ProgramCategoryDisplayType } from '../programCategoryApi';

/**
 * 섹션 카드 모양은 운영자에게 둘만 보인다.
 * "카드 목록" 은 CARDS 로 저장한다. 웹은 CARDS 를 대표 카드로 바꾸지 않고,
 * 멘토링만·블로그만 있는 섹션에는 전용 카드를 쓴다.
 * 저장 값 AUTO·MENTOR·BLOG 도 "카드 목록" 으로 보이고, 고른 것이 바뀔 때만 새 값을 보낸다
 */
export type CardStyle = 'FEATURED' | 'CARDS';

export const CARD_STYLE_LABEL: Record<CardStyle, string> = {
  FEATURED: '대표 상품 1개 (가로형)',
  CARDS: '카드 목록',
};

/** 웹 FeaturedChallenge·TargetCards 가 실제로 그리는 모양 그대로 적는다 */
export const CARD_STYLE_DESCRIPTION: Record<CardStyle, string> = {
  FEATURED:
    '첫 번째 상품 하나만 가로형 카드로 보여줍니다. 왼쪽에 썸네일, 오른쪽에 제목·설명·신청가·진행기간과 신청하기 버튼. 나머지 상품은 보이지 않습니다.',
  CARDS:
    '작은 카드(썸네일·유형·제목·진행기간)를 가로로 나열합니다. 처음 5장이 보이고 나머지는 더보기로 펼칩니다. 멘토링·블로그만 있는 섹션은 각자 전용 카드로 보여요.',
};

export const cardStyleOf = (
  displayType?: ProgramCategoryDisplayType | null,
): CardStyle => (displayType === 'FEATURED' ? 'FEATURED' : 'CARDS');

/** 저장할 값 */
export const displayTypeOfStyle = (
  style: CardStyle,
): ProgramCategoryDisplayType => (style === 'FEATURED' ? 'FEATURED' : 'CARDS');

/**
 * 보낼 값. 처음 보인 모양과 같으면 보내지 않는다(undefined) — 열고 저장만 해도 예전 값이 그대로 남는다
 */
export const displayTypeToSend = (
  saved: ProgramCategoryDisplayType | null | undefined,
  picked: CardStyle,
) => (picked === cardStyleOf(saved) ? undefined : displayTypeOfStyle(picked));

/**
 * 카드 목록으로 보이지만 예전 값으로 저장돼 웹 모양이 조금 다른 섹션.
 * AUTO 는 챌린지만 있으면 대표 카드가 되고, MENTOR·BLOG 는 유형과 관계없이 그 카드로 고정된다
 */
export const isLegacyFixedStyle = (
  saved: ProgramCategoryDisplayType | null | undefined,
) => saved === 'AUTO' || saved === 'MENTOR' || saved === 'BLOG';
