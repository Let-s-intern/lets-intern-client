import type { AutoTagProduct } from '../hooks/useAllProducts';
import type { ProgramCategoryTargetType } from '../programCategoryApi';
import type { ProductPlaces } from './productPlaces';

/**
 * 점검 대상 유형. 마그넷·블로그는 태그와 상관없이 각자의 화면에 나오고,
 * 1:1 멘토링은 사이트에서 따로 열리므로 뺀다
 */
const CHECKED_TARGET_TYPES: ProgramCategoryTargetType[] = [
  'CHALLENGE',
  'LIVE',
  'VOD',
  'GUIDEBOOK',
  'MEMBERSHIP',
];

export type NoPlaceReason = 'NO_TAG' | 'NO_PLACE';

export const NO_PLACE_REASON_LABEL: Record<NoPlaceReason, string> = {
  NO_TAG: '태그 없음',
  NO_PLACE: '붙은 분류가 모두 숨김이거나 노출 자리가 없음',
};

export interface NoPlaceProduct {
  key: string;
  targetType: ProgramCategoryTargetType;
  targetId: number;
  title: string;
  reason: NoPlaceReason;
  /** 수정 화면 경로. 라우트가 없으면 null */
  editPath: string | null;
}

/** router.tsx 의 실제 라우트 기준 */
export const editPathOf = (
  targetType: ProgramCategoryTargetType,
  targetId: number,
): string | null => {
  switch (targetType) {
    case 'CHALLENGE':
      return `/challenge/${targetId}/edit`;
    case 'LIVE':
      return `/live/${targetId}/edit`;
    case 'VOD':
      return `/vod/${targetId}/edit`;
    case 'GUIDEBOOK':
      return `/guidebook/${targetId}/edit`;
    case 'MEMBERSHIP':
      return `/all-in-one-pass/${targetId}/edit`;
    default:
      return null;
  }
};

const isEnded = (endDate: string | null | undefined, now: Date) => {
  if (!endDate) return false;
  return new Date(endDate).getTime() < now.getTime();
};

/**
 * 노출을 켰는데 사이트 어디에도 안 나오는 상품. 보기만 하는 계산이다.
 * places 는 productPlacesOf 의 결과이고, 거기에 없는 상품이 위치가 없는 상품이다.
 * isVisible 값이 없는 상품(서버가 아직 안 준 옛 응답)은 노출 여부를 모르므로 넣지 않는다
 */
export const productsWithoutPlaceOf = ({
  products,
  places,
  includeEnded,
  now,
}: {
  products: AutoTagProduct[];
  places: ProductPlaces[];
  includeEnded: boolean;
  now: Date;
}): NoPlaceProduct[] => {
  const placedKeys = new Set(
    places.filter((p) => p.places.length > 0).map((p) => p.key),
  );
  return products
    .filter((p) => CHECKED_TARGET_TYPES.includes(p.targetType))
    .filter((p) => p.isVisible === true)
    .filter((p) => includeEnded || !isEnded(p.endDate, now))
    .filter((p) => !placedKeys.has(`${p.targetType}-${p.targetId}`))
    .map((p) => ({
      key: `${p.targetType}-${p.targetId}`,
      targetType: p.targetType,
      targetId: p.targetId,
      title: p.title,
      reason: p.tagIds.length === 0 ? 'NO_TAG' : 'NO_PLACE',
      editPath: editPathOf(p.targetType, p.targetId),
    }));
};
