import type {
  CategoryLandingData,
  ProgramCategoryTarget,
  PublicProgramCategoryGroup,
  SectionDisplayType,
} from '@/api/program-category/programCategory';
import type { LandingContent } from './landingContent';

export interface LandingSectionData {
  id: number;
  title: string;
  description?: string;
  displayType?: SectionDisplayType | null;
  targets: ProgramCategoryTarget[];
}

/**
 * 랜딩 섹션. 새 분류 랜딩(섹션마다 서버가 상품을 풀어 줌)이 있으면 그것을,
 * 없으면 예전 랜딩(노출 목록의 카테고리 = 섹션, 상품은 다중 조회)을 쓴다. 상품이 없는 섹션은 숨긴다
 */
export const landingSectionsOf = ({
  landing,
  group,
  groupTargets,
  content,
}: {
  landing: CategoryLandingData | null | undefined;
  group: PublicProgramCategoryGroup | undefined;
  groupTargets: ProgramCategoryTarget[];
  content: LandingContent | undefined;
}): LandingSectionData[] => {
  const sections: LandingSectionData[] = landing
    ? landing.sectionList.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description ?? undefined,
        displayType: s.displayType,
        targets: s.targetList,
      }))
    : (group?.categoryList ?? []).map((category) => ({
        id: category.id,
        title: category.title,
        description:
          category.description ??
          (category.slug
            ? content?.sectionDescriptions?.[category.slug]
            : undefined),
        displayType: category.displayType,
        targets: groupTargets.filter((t) =>
          t.categoryIds.includes(category.id),
        ),
      }));
  return sections.filter((s) => s.targets.length > 0);
};
