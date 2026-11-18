import { SubNavItemProps } from '@/common/layout/header/SubNavItem';
import { JOURNEY_GROUPS } from '@/domain/career-journey/journeyNav';
import { useJourneyHrefMap } from '@/domain/career-journey/useJourneyHref';

/**
 * GNB "프로그램 카테고리" 드롭다운. 상품 이름 나열 대신 취준 여정(단계 → 고민) 순서로 보여 준다.
 * 회색 제목은 누르지 않고, 항목은 랜딩(또는 어드민이 지정한 상세)으로 간다
 */
export default function useProgramCategoryNav(): SubNavItemProps[] {
  const hrefMap = useJourneyHrefMap();

  return [
    { children: '전체', href: '/program' },
    ...JOURNEY_GROUPS.flatMap((group) => [
      ...(group.label
        ? [{ children: group.label, isHeader: true } as SubNavItemProps]
        : []),
      ...group.items.map((item) => ({
        children: item.label,
        href: hrefMap[item.slug],
        className: group.label ? 'pl-5 font-semibold' : 'font-semibold',
      })),
    ]),
  ];
}
