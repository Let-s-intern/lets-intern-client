import { WEB_MENU } from '../constants/webMenu';
import type {
  ProgramCategory,
  ProgramCategoryGroup,
} from '../programCategoryApi';

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const slugError = (slug: string) =>
  slug !== '' && !SLUG_PATTERN.test(slug)
    ? '영문 소문자·숫자·하이픈만 (예: resume, large-corp)'
    : undefined;

/**
 * 프로그램 분류(태그)는 필터 줄(용도 FILTER 인 노출 목록)에 든 카테고리다.
 * 용도가 LANDING 인 목록은 예전 랜딩이라 분류 화면에는 보이지 않는다(마이그레이션 대상)
 */
export const isTagGroup = (group: ProgramCategoryGroup) =>
  (group.purpose ?? 'FILTER') === 'FILTER';

export const filterRowsOf = (groups: ProgramCategoryGroup[]) =>
  groups.filter(isTagGroup);

export const legacyLandingGroupsOf = (groups: ProgramCategoryGroup[]) =>
  groups.filter((g) => !isTagGroup(g));

export interface TagRef {
  tag: ProgramCategory;
  row: ProgramCategoryGroup;
}

export const tagsOf = (groups: ProgramCategoryGroup[]): TagRef[] =>
  filterRowsOf(groups).flatMap((row) =>
    row.categoryList.map((tag) => ({ tag, row })),
  );

/** "서류 > 이력서". 같은 이름이 여러 줄에 있어도 구분된다 */
export const tagLabelOf = (groups: ProgramCategoryGroup[]) =>
  new Map(
    tagsOf(groups).map(({ tag, row }) => [
      tag.id,
      `${row.title} > ${tag.title}`,
    ]),
  );

/** 이름이 같은 분류 (예: 직무·관심 직무의 HR) */
export const duplicateTagTitles = (groups: ProgramCategoryGroup[]) => {
  const counts = new Map<string, number>();
  tagsOf(groups).forEach(({ tag }) =>
    counts.set(tag.title, (counts.get(tag.title) ?? 0) + 1),
  );
  return [...counts].filter(([, n]) => n > 1).map(([title]) => title);
};

export interface SiteMenuGroup {
  label: string | null;
  items: { slug: string; label: string }[];
}

export interface SiteMenu {
  /** admin = 분류의 메뉴 값, fallback = 메뉴에 올린 분류가 없어 웹 고정 메뉴가 보인다 */
  source: 'admin' | 'fallback';
  groups: SiteMenuGroup[];
}

/**
 * 사이트 GNB "프로그램 카테고리" 메뉴. 웹과 같은 규칙: 메뉴에 보이기를 켠 분류만, 묶음 이름으로 묶고 순서대로.
 * 하나도 없으면 웹은 고정 메뉴(journeyNav)를 쓴다
 */
export const siteMenuOf = (groups: ProgramCategoryGroup[]): SiteMenu => {
  const items = tagsOf(groups)
    .map(({ tag }) => tag)
    .filter((t) => t.showInMenu && t.slug)
    .map((t) => ({
      slug: t.slug as string,
      label: t.menuLabel || t.title,
      group: t.menuGroup?.trim() || null,
      order: t.menuOrder ?? Number.MAX_SAFE_INTEGER,
    }))
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

/** 이 주소로 들어오는 GNB·홈 항목. 예: "서류 작성 › 이력서" */
export const menuEntriesTo = (groups: ProgramCategoryGroup[], slug: string) =>
  siteMenuOf(groups).groups.flatMap((g) =>
    g.items
      .filter((item) => item.slug === slug)
      .map((item) => (g.label ? `${g.label} › ${item.label}` : item.label)),
  );

export const moveId = (ids: number[], index: number, direction: -1 | 1) => {
  const next = [...ids];
  [next[index], next[index + direction]] = [
    next[index + direction],
    next[index],
  ];
  return next;
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

/**
 * 전체 순서(ids) 안에서 id 를 같은 부분집합(subset)의 앞·뒤 이웃과 맞바꾼다.
 * 필터 줄만 보이는 화면에서 위·아래를 누르면 보이는 순서대로 움직이게 한다
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

/** 자동 태그 규칙: 태그마다 이름과 키워드 */
export const autoTagRulesOf = (groups: ProgramCategoryGroup[]) =>
  tagsOf(groups).map(({ tag }) => ({
    id: tag.id,
    title: tag.title,
    keywords: tag.autoKeywords ?? [],
  }));
