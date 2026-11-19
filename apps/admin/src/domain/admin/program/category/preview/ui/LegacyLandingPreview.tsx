import { usePublicCategoryTargets } from '../../hooks/usePublicCategoryTargets';
import type { ProgramCategoryGroup } from '../../programCategoryApi';
import { siteMenuOf } from '../../utils/tagUtils';
import LandingPreview, { type PreviewHighlight } from './LandingPreview';

/** 이 주소의 예전 랜딩(노출 목록). 분류에 섹션이 없을 때 웹이 대신 그리는 것과 같다 */
export const legacyLandingOf = (groups: ProgramCategoryGroup[], slug: string) =>
  groups.find(
    (g) =>
      (g.purpose ?? 'FILTER') === 'LANDING' &&
      (g.slug === slug ||
        (g.placements ?? []).some(
          (p) => p.placementType === 'LANDING' && p.slug === slug,
        )),
  );

/** 예전 랜딩 미리보기. 노출 목록의 카테고리 = 섹션, 상품은 공개 다중 조회 */
const LegacyLandingPreview = ({
  group,
  groups,
  slug,
  highlight,
}: {
  group: ProgramCategoryGroup;
  groups: ProgramCategoryGroup[];
  slug: string;
  highlight?: PreviewHighlight;
}) => {
  const sections = group.categoryList.filter((c) => c.isVisible);
  const merge =
    (group.placements ?? []).find(
      (p) => p.placementType === 'LANDING' && p.slug === slug,
    )?.mergeChallenges ?? true;
  const { data: targets = [], isLoading } = usePublicCategoryTargets(
    sections.map((c) => c.id),
    merge,
  );
  if (isLoading)
    return <p className="text-xsmall14 text-neutral-40">불러오는 중…</p>;
  return (
    <div className="flex flex-col gap-2">
      <p className="rounded-xs bg-neutral-95 px-3 py-2 text-xxsmall12 text-neutral-30">
        이 태그에 아직 섹션이 없어 사이트에는 예전 랜딩(&quot;{group.title}
        &quot;)이 보여요. 점검 탭에서 옮기면 여기서 고칠 수 있어요.
      </p>
      <LandingPreview
        slug={slug}
        title={group.title}
        menu={siteMenuOf(groups)}
        sections={sections.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          displayType: c.displayType,
          targets: targets.filter((t) => t.categoryIds.includes(c.id)),
        }))}
        highlight={highlight}
      />
    </div>
  );
};

export default LegacyLandingPreview;
