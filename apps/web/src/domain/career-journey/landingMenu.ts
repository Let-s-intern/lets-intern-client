import type { LandingMenuItem } from '@/api/program-category/programCategory';
import { JOURNEY_GROUPS, type JourneyGroup } from './journeyNav';

/**
 * 어드민 메뉴 값으로 취준 여정 메뉴를 만든다. menuGroup 으로 묶고 menuOrder 순으로 놓는다.
 * 묶음 자리는 그 안의 가장 작은 순서다(서버가 순서대로 주므로 처음 나온 순서).
 * 메뉴 값이 하나도 없으면(서버·데이터가 아직 없을 때) 고정 메뉴 JOURNEY_GROUPS 를 쓴다
 */
export const buildJourneyGroups = (
  menuList: LandingMenuItem[] | undefined,
): JourneyGroup[] => {
  if (!menuList || menuList.length === 0) return JOURNEY_GROUPS;
  const sorted = [...menuList].sort(
    (a, b) =>
      (a.menuOrder ?? Number.MAX_SAFE_INTEGER) -
      (b.menuOrder ?? Number.MAX_SAFE_INTEGER),
  );
  const byLabel = new Map<string | null, JourneyGroup>();
  sorted.forEach((item) => {
    const label = item.menuGroup?.trim() || null;
    const group = byLabel.get(label) ?? { label, items: [] };
    group.items.push({ slug: item.slug, label: item.menuLabel || item.slug });
    byLabel.set(label, group);
  });
  return [...byLabel.values()];
};

/** 메뉴 slug → 브레드크럼 [묶음, 이름] */
export const findJourneyItem = (groups: JourneyGroup[], slug: string) => {
  for (const group of groups) {
    const item = group.items.find((i) => i.slug === slug);
    if (item) return { groupLabel: group.label, label: item.label };
  }
  return null;
};
