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
/** 랜딩 위치의 GNB 메뉴·상단 문구. 빈 문자열은 서버에서 비운다 */
export interface LandingMenuDraft {
  showInMenu: boolean;
  menuGroup: string;
  /** 비우면 노출 목록 이름 */
  menuLabel: string;
  menuOrder: number | null;
  heroTitle: string;
  heroDescription: string;
}

export const EMPTY_LANDING_MENU: LandingMenuDraft = {
  showInMenu: false,
  menuGroup: '',
  menuLabel: '',
  menuOrder: null,
  heroTitle: '',
  heroDescription: '',
};

/** 초안에서 메뉴·상단 문구만 꺼낸다. 없으면 빈 값 */
export const landingMenuOf = (
  d?: Partial<LandingMenuDraft>,
): LandingMenuDraft => ({
  showInMenu: d?.showInMenu ?? EMPTY_LANDING_MENU.showInMenu,
  menuGroup: d?.menuGroup ?? EMPTY_LANDING_MENU.menuGroup,
  menuLabel: d?.menuLabel ?? EMPTY_LANDING_MENU.menuLabel,
  menuOrder: d?.menuOrder ?? EMPTY_LANDING_MENU.menuOrder,
  heroTitle: d?.heroTitle ?? EMPTY_LANDING_MENU.heroTitle,
  heroDescription: d?.heroDescription ?? EMPTY_LANDING_MENU.heroDescription,
});

export interface PlacementDraft extends Partial<LandingMenuDraft> {
  placementType: ProgramCategoryPlacementType;
  slug: string;
  mergeChallenges: boolean;
  matchMode: ProgramCategoryMatchMode;
}

/**
 * 받은 노출 위치를 고칠 수 있는 모양으로. 서버는 메뉴 이름이 비면 목록 이름을 채워 주므로,
 * 목록 이름과 같으면 비운 것으로 둔다 (그대로 다시 보내 목록 이름이 저장되지 않게)
 */
export const toDraft = (
  p: ProgramCategoryPlacement,
  groupTitle?: string,
): PlacementDraft => ({
  placementType: p.placementType,
  slug: p.slug ?? '',
  mergeChallenges: p.mergeChallenges ?? true,
  matchMode: p.matchMode === 'ALL' ? 'ALL' : 'ANY',
  showInMenu: p.showInMenu ?? false,
  menuGroup: p.menuGroup ?? '',
  menuLabel: p.menuLabel && p.menuLabel !== groupTitle ? p.menuLabel : '',
  menuOrder: p.menuOrder ?? null,
  heroTitle: p.heroTitle ?? '',
  heroDescription: p.heroDescription ?? '',
});

/** 요청 모양. 메뉴·상단 문구는 랜딩에만 싣는다. 저장은 통째 교체라 안 바꾼 값도 그대로 다시 보낸다 */
export const toPlacementInput = (d: PlacementDraft) => {
  const landing = d.placementType === 'LANDING';
  return {
    placementType: d.placementType,
    slug: landing ? d.slug : undefined,
    mergeChallenges: d.mergeChallenges,
    matchMode: d.placementType === 'PROGRAM_FILTER' ? d.matchMode : undefined,
    ...(landing
      ? {
          showInMenu: d.showInMenu ?? false,
          menuGroup: d.menuGroup ?? '',
          menuLabel: d.menuLabel ?? '',
          menuOrder: d.menuOrder ?? undefined,
          heroTitle: d.heroTitle ?? '',
          heroDescription: d.heroDescription ?? '',
        }
      : {}),
  };
};

export const isDraftInvalid = (d: PlacementDraft) =>
  d.placementType === 'LANDING' &&
  (d.slug === '' || Boolean(slugError(d.slug)));

export const draftsOf = (group: ProgramCategoryGroup) =>
  (group.placements ?? []).map((p) => toDraft(p, group.title));

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

export interface SiteMenuGroup {
  /** 묶음 이름. 비워 두면 null */
  label: string | null;
  items: { slug: string; label: string }[];
}

export interface SiteMenu {
  /** admin = 어드민에서 정한 메뉴, fallback = 아직 아무 랜딩도 메뉴에 안 올려 웹 고정 메뉴가 보인다 */
  source: 'admin' | 'fallback';
  groups: SiteMenuGroup[];
}

/**
 * 사이트 GNB "프로그램 카테고리" 메뉴. 웹과 같은 규칙으로 만든다.
 * 보이는 목록의 랜딩 중 메뉴에 보이기만, 묶음 이름으로 묶고 순서대로. 묶음 자리는 그 안의 가장 작은 순서.
 * 하나도 없으면 웹은 고정 메뉴(journeyNav)를 쓴다
 */
export const siteMenuOf = (groups: ProgramCategoryGroup[]): SiteMenu => {
  const items = groups
    .filter((g) => g.isVisible)
    .flatMap((g) =>
      (g.placements ?? [])
        .filter((p) => p.placementType === 'LANDING' && p.slug && p.showInMenu)
        .map((p) => ({
          slug: p.slug as string,
          label: p.menuLabel || g.title,
          group: p.menuGroup?.trim() || null,
          order: p.menuOrder ?? Number.MAX_SAFE_INTEGER,
        })),
    )
    .sort((a, b) => a.order - b.order);
  if (items.length === 0)
    return {
      source: 'fallback',
      groups: WEB_MENU.map((m) => ({ label: m.group, items: m.items })),
    };
  const byLabel = new Map<string | null, SiteMenuGroup>();
  items.forEach(({ slug, label, group }) => {
    const entry = byLabel.get(group) ?? { label: group, items: [] };
    entry.items.push({ slug, label });
    byLabel.set(group, entry);
  });
  return { source: 'admin', groups: [...byLabel.values()] };
};

/** 이 주소의 랜딩으로 들어오는 GNB·홈 항목. 예: "서류 작성 › 이력서" */
export const menuEntriesTo = (groups: ProgramCategoryGroup[], slug: string) => {
  const menu = siteMenuOf(groups);
  return menu.groups.flatMap((g) =>
    g.items
      .filter(
        (item) =>
          item.slug === slug &&
          (menu.source === 'admin' ||
            menuDestinationOf(groups, item.slug).kind === 'landing'),
      )
      .map((item) => (g.label ? `${g.label} › ${item.label}` : item.label)),
  );
};

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
