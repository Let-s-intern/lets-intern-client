import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import {
  displayTypeLabel,
  programCategoryTargetTypeLabel,
  type ProgramCategory,
  type ProgramCategoryGroup,
  type ProgramCategoryTargetType,
} from './programCategoryApi';

/**
 * 웹 GNB "프로그램 카테고리" 메뉴와 홈 고민 섹션 카드. 웹에 고정된 구조라 여기도 같은 값을 둔다
 * (apps/web/src/domain/career-journey/journeyNav.ts 의 JOURNEY_GROUPS)
 */
const WEB_MENU: { group: string; items: { slug: string; label: string }[] }[] =
  [
    { group: '스펙 정리', items: [{ slug: 'experience', label: '경험정리' }] },
    {
      group: '서류 작성',
      items: [
        { slug: 'resume', label: '이력서' },
        { slug: 'personal-statement', label: '자기소개서' },
        { slug: 'portfolio', label: '포트폴리오' },
      ],
    },
    {
      group: '대기업',
      items: [
        { slug: 'large-corp', label: '대기업 자기소개서' },
        { slug: 'aptitude', label: '인적성' },
      ],
    },
    { group: '면접', items: [{ slug: 'interview', label: '면접' }] },
    {
      group: '직무특화',
      items: [
        { slug: 'hr', label: 'HR' },
        { slug: 'marketing', label: '마케팅' },
        { slug: 'pm', label: 'PM/PO' },
      ],
    },
  ];

const targetSchema = z.object({
  targetType: z.string(),
  targetId: z.number(),
  title: z.string(),
  categoryIds: z.array(z.number()),
});

/** 공개 다중 조회로 실제 사용자 화면과 같은 결과를 본다 */
const useTargets = (categoryIds: number[], mergeChallenges: boolean) =>
  useQuery({
    queryKey: ['adminPlacementOverview', categoryIds, mergeChallenges],
    queryFn: async () => {
      const res = await axios.get('/program-category/targets', {
        params: {
          categoryIds: categoryIds.join(','),
          groupChallenges: mergeChallenges,
        },
      });
      return z
        .object({ targetList: z.array(targetSchema) })
        .parse(res.data.data).targetList;
    },
    enabled: categoryIds.length > 0,
    refetchOnWindowFocus: false,
  });

const PREVIEW = 4;

const typeLabel = (type: string) =>
  programCategoryTargetTypeLabel[type as ProgramCategoryTargetType] ?? type;

const LandingCard = ({
  group,
  slug,
  mergeChallenges,
}: {
  group: ProgramCategoryGroup;
  slug: string;
  mergeChallenges: boolean;
}) => {
  const sections = group.categoryList.filter((c) => c.isVisible);
  const { data: targets = [], isLoading } = useTargets(
    sections.map((c) => c.id),
    mergeChallenges,
  );
  return (
    <section className="rounded-sm border border-neutral-80 bg-white p-3">
      <p className="font-semibold text-neutral-0">
        /category/{slug}{' '}
        <span className="text-xsmall14 font-normal text-neutral-40">
          {group.title}
          {group.isVisible ? '' : ' · 숨김(안 보임)'}
          {mergeChallenges ? ' · 챌린지 한 장' : ' · 챌린지 기수별'}
        </span>
      </p>
      {isLoading ? (
        <p className="mt-2 text-xsmall14 text-neutral-40">불러오는 중…</p>
      ) : (
        <ol className="mt-2 flex flex-col gap-2">
          {sections.map((section: ProgramCategory, index) => {
            const items = targets.filter((t) =>
              t.categoryIds.includes(section.id),
            );
            return (
              <li key={section.id} className="text-xsmall14">
                <p className="font-semibold text-neutral-10">
                  {index + 1}. {section.title}{' '}
                  <span className="font-normal text-neutral-40">
                    {displayTypeLabel[section.displayType ?? 'AUTO']} · 상품{' '}
                    {items.length}개
                    {items.length === 0 ? ' (비어 있어 화면에서 숨김)' : ''}
                  </span>
                </p>
                {section.description && (
                  <p className="text-neutral-40">“{section.description}”</p>
                )}
                {items.length > 0 && (
                  <p className="text-neutral-30">
                    {items
                      .slice(0, PREVIEW)
                      .map((t) => `[${typeLabel(t.targetType)}] ${t.title}`)
                      .join(' / ')}
                    {items.length > PREVIEW
                      ? ` 외 ${items.length - PREVIEW}개`
                      : ''}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
};

/** 노출 위치마다 실제로 무엇이 나가는지. 랜딩·전체 프로그램 필터·GNB 메뉴·홈 고민 섹션 */
const ProgramCategoryPlacementOverview = ({
  groups,
}: {
  groups: ProgramCategoryGroup[];
}) => {
  const landings = groups.flatMap((group) =>
    (group.placements ?? [])
      .filter((p) => p.placementType === 'LANDING' && p.slug)
      .map((p) => ({
        group,
        slug: p.slug as string,
        mergeChallenges: p.mergeChallenges ?? true,
      })),
  );
  const filters = groups.flatMap((group) =>
    (group.placements ?? [])
      .filter((p) => p.placementType === 'PROGRAM_FILTER')
      .map((p) => ({ group, matchMode: p.matchMode })),
  );
  const filterCategoryBySlug = new Map(
    filters.flatMap(({ group }) =>
      group.categoryList
        .filter((c) => c.slug)
        .map((c) => [c.slug as string, c] as const),
    ),
  );
  const landingSlugs = new Set(
    landings.filter((l) => l.group.isVisible).map((l) => l.slug),
  );
  const destination = (slug: string) => {
    const category = filterCategoryBySlug.get(slug);
    if (category?.directTargetType && category.directTargetId)
      return `상세로 바로 → ${programCategoryTargetTypeLabel[category.directTargetType]} #${category.directTargetId}`;
    return landingSlugs.has(slug)
      ? `/category/${slug} 랜딩`
      : `/category/${slug} — 랜딩 없음 ("준비 중" 화면)`;
  };

  return (
    <div className="mt-4 flex flex-col gap-8">
      <div>
        <h3 className="mb-2 text-small18 font-bold">카테고리 랜딩 페이지</h3>
        {landings.length === 0 ? (
          <p className="text-xsmall14 text-neutral-40">
            랜딩 노출 위치가 붙은 노출 목록이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {landings.map((l) => (
              <LandingCard key={`${l.group.id}-${l.slug}`} {...l} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-small18 font-bold">
          전체 프로그램 필터 (/program)
        </h3>
        {filters.length === 0 ? (
          <p className="text-xsmall14 text-neutral-40">
            필터 노출 위치가 붙은 노출 목록이 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col gap-1 text-xsmall14">
            {filters.map(({ group, matchMode }) => (
              <li key={group.id}>
                <span className="font-semibold">{group.title}</span>
                <span className="text-neutral-40">
                  {' '}
                  ({matchMode === 'ALL' ? '모두' : '하나라도'}
                  {group.isVisible ? '' : ' · 숨김'}) —{' '}
                </span>
                {group.categoryList
                  .filter((c) => c.isVisible)
                  .map((c) => `${c.title} ${c.programCount}`)
                  .join(' · ')}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="mb-1 text-small18 font-bold">GNB 메뉴 · 홈 고민 섹션</h3>
        <p className="mb-2 text-xsmall14 text-neutral-40">
          메뉴 구조는 웹에 고정돼 있습니다. 항목을 누르면 아래로 갑니다. 필터
          카테고리 키와 같은 이름의 랜딩이 있으면 랜딩, 바로 갈 상품이 있으면
          상세로 갑니다.
        </p>
        <ul className="flex flex-col gap-1 text-xsmall14">
          {WEB_MENU.map((menu) => (
            <li key={menu.group}>
              <span className="font-semibold">{menu.group}</span>
              <ul className="ml-4">
                {menu.items.map((item) => (
                  <li key={item.slug}>
                    {item.label}{' '}
                    <span className="text-neutral-40">
                      → {destination(item.slug)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProgramCategoryPlacementOverview;
