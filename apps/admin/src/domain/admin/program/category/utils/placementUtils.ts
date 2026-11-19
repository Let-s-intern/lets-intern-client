import { WEB_MENU } from '../constants/webMenu';
import type { PublicCategoryTarget } from '../hooks/usePublicCategoryTargets';
import type {
  ProgramCategory,
  ProgramCategoryGroup,
  ProgramCategoryMatchMode,
  ProgramCategoryPlacement,
  ProgramCategoryPlacementType,
  ProgramCategoryTargetType,
} from '../programCategoryApi';

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const slugError = (slug: string) =>
  slug !== '' && !SLUG_PATTERN.test(slug)
    ? '영문 소문자·숫자·하이픈만 (예: resume, large-corp)'
    : undefined;

/** 화면에서 고치는 노출 위치 한 개. 저장할 때 toPlacementInput 으로 요청 모양이 된다 */
export interface PlacementDraft {
  placementType: ProgramCategoryPlacementType;
  slug: string;
  mergeChallenges: boolean;
  matchMode: ProgramCategoryMatchMode;
}

export const toDraft = (p: ProgramCategoryPlacement): PlacementDraft => ({
  placementType: p.placementType,
  slug: p.slug ?? '',
  mergeChallenges: p.mergeChallenges ?? true,
  matchMode: p.matchMode === 'ALL' ? 'ALL' : 'ANY',
});

export const toPlacementInput = (d: PlacementDraft) => ({
  placementType: d.placementType,
  slug: d.placementType === 'LANDING' ? d.slug : undefined,
  mergeChallenges: d.mergeChallenges,
  matchMode: d.placementType === 'PROGRAM_FILTER' ? d.matchMode : undefined,
});

export const isDraftInvalid = (d: PlacementDraft) =>
  d.placementType === 'LANDING' &&
  (d.slug === '' || Boolean(slugError(d.slug)));

export const draftsOf = (group: ProgramCategoryGroup) =>
  (group.placements ?? []).map(toDraft);

/** 노출 위치 저장은 통째로 교체다. 하나만 고칠 때도 나머지를 그대로 다시 보낸다 */
export const draftsWith = (
  group: ProgramCategoryGroup,
  index: number,
  patch: Partial<PlacementDraft>,
) => draftsOf(group).map((d, i) => (i === index ? { ...d, ...patch } : d));

export const draftsWithout = (group: ProgramCategoryGroup, index: number) =>
  draftsOf(group).filter((_, i) => i !== index);

export const draftsAppended = (
  group: ProgramCategoryGroup,
  draft: PlacementDraft,
) => [...draftsOf(group), draft];

export const moveId = (ids: number[], index: number, direction: -1 | 1) => {
  const next = [...ids];
  [next[index], next[index + direction]] = [
    next[index + direction],
    next[index],
  ];
  return next;
};

/**
 * 전체 순서(ids) 안에서 id 를 같은 부분집합(subset)의 앞·뒤 이웃과 맞바꾼다.
 * 필터 줄처럼 일부 목록만 보이는 화면에서 위·아래를 누르면 보이는 순서대로 움직이게 한다
 */
export const moveAmong = (
  ids: number[],
  subset: number[],
  id: number,
  direction: -1 | 1,
) => {
  const ordered = ids.filter((v) => subset.includes(v));
  const neighbor = ordered[ordered.indexOf(id) + direction];
  if (neighbor === undefined) return ids;
  return ids.map((v) => (v === id ? neighbor : v === neighbor ? id : v));
};

/**
 * 방금 만든 노출 목록 찾기. 생성 API 가 id 를 주지 않아서,
 * 만들기 전 목록(before)에 없던 것 중 같은 이름에서 id 가 가장 큰 것을 고른다
 */
export const findCreatedGroup = (
  before: ProgramCategoryGroup[],
  after: ProgramCategoryGroup[],
  title: string,
) => {
  const known = new Set(before.map((g) => g.id));
  return after
    .filter((g) => g.title === title && !known.has(g.id))
    .sort((a, b) => b.id - a.id)[0];
};

export interface LandingPage {
  group: ProgramCategoryGroup;
  /** group.placements 안의 위치. 저장할 때 이 자리만 바꾼다 */
  placementIndex: number;
  slug: string;
  mergeChallenges: boolean;
}

/** 랜딩 노출 위치가 붙은 곳. 랜딩 페이지 하나 = 노출 목록 하나 + 주소 */
export const landingPagesOf = (groups: ProgramCategoryGroup[]): LandingPage[] =>
  groups.flatMap((group) =>
    (group.placements ?? []).flatMap((p, placementIndex) =>
      p.placementType === 'LANDING' && p.slug
        ? [
            {
              group,
              placementIndex,
              slug: p.slug,
              mergeChallenges: p.mergeChallenges ?? true,
            },
          ]
        : [],
    ),
  );

export interface FilterRow {
  group: ProgramCategoryGroup;
  placementIndex: number;
  matchMode: ProgramCategoryMatchMode;
  mergeChallenges: boolean;
}

/** 전체 프로그램 필터 줄. 필터 줄 하나 = 노출 목록 하나, 버튼 = 그 안의 카테고리 */
export const filterRowsOf = (groups: ProgramCategoryGroup[]): FilterRow[] =>
  groups.flatMap((group) =>
    (group.placements ?? []).flatMap((p, placementIndex) =>
      p.placementType === 'PROGRAM_FILTER'
        ? [
            {
              group,
              placementIndex,
              matchMode:
                p.matchMode === 'ALL' ? ('ALL' as const) : ('ANY' as const),
              mergeChallenges: p.mergeChallenges ?? true,
            },
          ]
        : [],
    ),
  );

export type MenuDestination =
  | {
      kind: 'direct';
      targetType: ProgramCategoryTargetType;
      targetId: number;
    }
  | { kind: 'landing'; slug: string }
  | { kind: 'missing'; slug: string };

/**
 * GNB·홈 항목이 어디로 가는지. 필터 카테고리 키가 같고 바로 갈 상품이 있으면 상세,
 * 아니면 같은 키의 보이는 랜딩, 랜딩이 없으면 "준비 중" 화면이다
 */
export const menuDestinationOf = (
  groups: ProgramCategoryGroup[],
  slug: string,
): MenuDestination => {
  const category = filterRowsOf(groups)
    .flatMap(({ group }) => group.categoryList)
    .find((c) => c.slug === slug);
  if (category?.directTargetType && category.directTargetId)
    return {
      kind: 'direct',
      targetType: category.directTargetType,
      targetId: category.directTargetId,
    };
  const hasLanding = landingPagesOf(groups).some(
    (l) => l.group.isVisible && l.slug === slug,
  );
  return { kind: hasLanding ? 'landing' : 'missing', slug };
};

/** 이 주소의 랜딩으로 들어오는 GNB·홈 항목. 예: "서류 작성 › 이력서" */
export const menuEntriesTo = (groups: ProgramCategoryGroup[], slug: string) =>
  WEB_MENU.flatMap((menu) =>
    menu.items
      .filter(
        (item) =>
          item.slug === slug &&
          menuDestinationOf(groups, item.slug).kind === 'landing',
      )
      .map((item) => `${menu.group} › ${item.label}`),
  );

/** 랜딩에 실제로 보이는 섹션. 숨긴 카테고리는 빠진다 */
export const visibleSections = (group: ProgramCategoryGroup) =>
  group.categoryList.filter((c) => c.isVisible);

export interface ProductExposure {
  key: string;
  targetType: string;
  title: string;
  places: string[];
}

/** 카테고리 하나가 어디에 보이는지. 노출 목록의 노출 위치마다 한 줄 */
const placesOfCategory = (
  group: ProgramCategoryGroup,
  category: ProgramCategory,
) =>
  (group.placements ?? []).map((p) =>
    p.placementType === 'LANDING'
      ? `/category/${p.slug ?? '?'} › ${category.title}`
      : `전체 프로그램 필터 › ${group.title} › ${category.title}`,
  );

/** 상품마다 노출되는 곳. 제목순 */
export const productExposuresOf = (
  groups: ProgramCategoryGroup[],
  targets: PublicCategoryTarget[],
): ProductExposure[] => {
  const placesByCategory = new Map(
    groups.flatMap((group) =>
      group.categoryList.map(
        (c) => [c.id, placesOfCategory(group, c)] as const,
      ),
    ),
  );
  const byKey = new Map<string, ProductExposure>();
  targets.forEach((t) => {
    const key = `${t.targetType}-${t.targetId}`;
    const entry = byKey.get(key) ?? {
      key,
      targetType: t.targetType,
      title: t.title,
      places: [],
    };
    t.categoryIds.forEach((id) =>
      (placesByCategory.get(id) ?? []).forEach((place) => {
        if (!entry.places.includes(place)) entry.places.push(place);
      }),
    );
    byKey.set(key, entry);
  });
  return [...byKey.values()].sort((a, b) => a.title.localeCompare(b.title));
};
