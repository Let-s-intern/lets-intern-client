import { usePublicCategoryTargets } from '../hooks/usePublicCategoryTargets';
import {
  displayTypeLabel,
  programCategoryTargetTypeLabel,
  type ProgramCategoryGroup,
  type ProgramCategoryTargetType,
} from '../programCategoryApi';
import { visibleSections } from '../utils/placementUtils';

const typeLabel = (type: string) =>
  programCategoryTargetTypeLabel[type as ProgramCategoryTargetType] ?? type;

/**
 * 랜딩 페이지가 실제로 어떻게 나가는지. 공개 API 로 사용자 화면과 같은 상품을 받아
 * 섹션 순서·카드 모양·상품 수를 보여준다. 상품이 없는 섹션은 사이트에서 숨겨진다
 */
const LandingPreview = ({
  group,
  mergeChallenges,
  maxProducts = 4,
}: {
  group: ProgramCategoryGroup;
  mergeChallenges: boolean;
  maxProducts?: number;
}) => {
  const sections = visibleSections(group);
  const { data: targets = [], isLoading } = usePublicCategoryTargets(
    sections.map((c) => c.id),
    mergeChallenges,
  );

  if (sections.length === 0)
    return (
      <p className="text-xsmall14 text-neutral-40">
        보이는 섹션이 없습니다. 섹션을 추가하거나 숨김을 푸세요.
      </p>
    );
  if (isLoading)
    return <p className="text-xsmall14 text-neutral-40">불러오는 중…</p>;

  return (
    <ol className="flex flex-col gap-3">
      {sections.map((section, index) => {
        const items = targets.filter((t) => t.categoryIds.includes(section.id));
        const empty = items.length === 0;
        return (
          <li
            key={section.id}
            className={`rounded-xs border p-2 text-xsmall14 ${
              empty
                ? 'border-dashed border-red-300 bg-red-50'
                : 'border-neutral-80'
            }`}
          >
            <p className="font-semibold text-neutral-10">
              {index + 1}. {section.title}
            </p>
            <p className="text-xxsmall12 text-neutral-40">
              {displayTypeLabel[section.displayType ?? 'AUTO']} · 상품{' '}
              {items.length}개
            </p>
            {section.description && (
              <p className="mt-0.5 text-neutral-30">{section.description}</p>
            )}
            {empty ? (
              <p className="mt-1 text-xxsmall12 font-semibold text-red-500">
                비어 있음 · 상품이 없어 사이트에서는 이 섹션이 안 보입니다
              </p>
            ) : (
              <ul className="mt-1 flex flex-wrap gap-1">
                {items.slice(0, maxProducts).map((t) => (
                  <li
                    key={`${t.targetType}-${t.targetId}`}
                    className="max-w-full truncate rounded-xs bg-neutral-95 px-1.5 py-0.5 text-xxsmall12 text-neutral-20"
                  >
                    [{typeLabel(t.targetType)}] {t.title}
                  </li>
                ))}
                {items.length > maxProducts && (
                  <li className="px-1 py-0.5 text-xxsmall12 text-neutral-40">
                    외 {items.length - maxProducts}개
                  </li>
                )}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default LandingPreview;
