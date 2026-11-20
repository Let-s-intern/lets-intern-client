import type { ProgramCategoryLanding } from '../programCategoryApi';
import type { TagRef } from '../utils/tagUtils';
import type { Visual } from './VisualDialog';

export interface ProductPlace {
  label: string;
  visual: Visual;
}

export interface ProductPlaces {
  key: string;
  targetType: string;
  targetId: number;
  title: string;
  places: ProductPlace[];
}

import type { PublicCategoryTarget } from '../hooks/usePublicCategoryTargets';

/**
 * 상품마다 보이는 곳. 랜딩은 섹션 결과(사이트와 같은 조건 풀이)로, 필터는 상품이 가진 분류로 센다.
 * 눌렀을 때 그 화면을 그 상품을 짚어 연다
 */
export const productPlacesOf = (
  tags: TagRef[],
  landings: Map<string, ProgramCategoryLanding | null>,
  filterTargets: PublicCategoryTarget[],
): ProductPlaces[] => {
  const byKey = new Map<string, ProductPlaces>();
  const entry = (t: {
    targetType?: string;
    targetId?: number;
    title?: string;
  }) => {
    const key = `${t.targetType}-${t.targetId}`;
    const found = byKey.get(key) ?? {
      key,
      targetType: t.targetType ?? '',
      targetId: t.targetId ?? 0,
      title: t.title ?? '',
      places: [],
    };
    byKey.set(key, found);
    return found;
  };
  tags.forEach(({ tag }) => {
    const landing = tag.slug ? landings.get(tag.slug) : null;
    landing?.sectionList.forEach((section, index) =>
      section.targetList.forEach((t) =>
        entry(t).places.push({
          label: `/category/${tag.slug} ${index + 1}. ${section.title}`,
          visual: {
            kind: 'landing',
            tagId: tag.id,
            highlight: {
              sectionId: section.id,
              target: { targetType: t.targetType, targetId: t.targetId },
            },
          },
        }),
      ),
    );
  });
  const tagById = new Map(tags.map((t) => [t.tag.id, t]));
  filterTargets.forEach((t) =>
    (t.categoryIds ?? []).forEach((id) => {
      const ref = tagById.get(id);
      if (!ref) return;
      entry(t).places.push({
        label: `필터 ${ref.row.title} > ${ref.tag.title}`,
        visual: {
          kind: 'filter',
          tagId: id,
          highlight: {
            targetType: t.targetType ?? '',
            targetId: t.targetId ?? 0,
          },
        },
      });
    }),
  );
  return [...byKey.values()].sort((a, b) => a.title.localeCompare(b.title));
};
