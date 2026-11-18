import { useFilterProgramCategoryGroupsQuery } from '@/api/program-category/programCategory';
import { getTargetHref, getLandingHref, JOURNEY_GROUPS } from './journeyNav';

/**
 * 메뉴 항목 slug → 이동 주소. 어드민 노출 분류에서 그 키의 카테고리에 "바로 갈 상품" 을 지정했으면
 * 상세로, 아니면 랜딩으로. 노출 분류를 불러오기 전에도 랜딩 주소를 돌려줘 링크가 비지 않는다
 */
export const useJourneyHrefMap = (): Record<string, string> => {
  const { data: groups = [] } = useFilterProgramCategoryGroupsQuery();
  const categories = groups.flatMap((group) => group.categoryList);

  return Object.fromEntries(
    JOURNEY_GROUPS.flatMap((group) => group.items).map(({ slug }) => {
      const category = categories.find((c) => c.slug === slug);
      const href =
        category?.directTargetType && category.directTargetId
          ? getTargetHref(category.directTargetType, category.directTargetId)
          : getLandingHref(slug);
      return [slug, href];
    }),
  );
};
