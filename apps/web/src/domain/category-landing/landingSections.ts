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

/** 끝난 LIVE 클래스. 진행 종료 시각이 지났으면 랜딩에 두지 않는다 */
const isEndedLive = (target: ProgramCategoryTarget, now: Date) =>
  target.targetType === 'LIVE' &&
  !!target.endDate &&
  new Date(target.endDate) < now;

/**
 * 랜딩 섹션. 새 분류 랜딩(섹션마다 서버가 상품을 풀어 줌)이 있으면 그것을,
 * 없으면 예전 랜딩(노출 목록의 카테고리 = 섹션, 상품은 다중 조회)을 쓴다.
 * 끝난 LIVE 클래스는 빼고, 그래서 상품이 없어진 섹션도 숨긴다
 */
export const landingSectionsOf = ({
  landing,
  group,
  groupTargets,
  content,
  now = new Date(),
}: {
  landing: CategoryLandingData | null | undefined;
  group: PublicProgramCategoryGroup | undefined;
  groupTargets: ProgramCategoryTarget[];
  content: LandingContent | undefined;
  now?: Date;
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
  return sections
    .map((s) => ({
      ...s,
      targets: s.targets.filter((t) => !isEndedLive(t, now)),
    }))
    .filter((s) => s.targets.length > 0);
};
