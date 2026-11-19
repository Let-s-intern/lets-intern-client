import {
  usePublicCategoryTargets,
  type PublicCategoryTarget,
} from '../hooks/usePublicCategoryTargets';
import {
  programCategoryTargetTypeLabel,
  type ProgramCategory,
  type ProgramCategoryGroup,
  type ProgramCategoryTargetType,
} from '../programCategoryApi';
import { visibleSections } from '../utils/placementUtils';
import { resolveStyle } from '../utils/previewStyle';

const MAX_CARDS = 4;

/** 섹션 위 작은 라벨. 담긴 상품 유형을 이어 쓴다 */
const eyebrowOf = (items: PublicCategoryTarget[]) =>
  [...new Set(items.map((t) => t.targetType))]
    .map(
      (type) =>
        programCategoryTargetTypeLabel[type as ProgramCategoryTargetType] ??
        type,
    )
    .join(' · ');

const Thumb = ({
  src,
  className,
}: {
  src?: string | null;
  className: string;
}) =>
  src ? (
    <img src={src} alt="" className={`${className} object-cover`} />
  ) : (
    <div className={`${className} bg-neutral-90`} />
  );

const SmallCard = ({
  item,
  round,
}: {
  item: PublicCategoryTarget;
  round: boolean;
}) => (
  <div className="flex min-w-0 flex-col gap-1">
    <Thumb
      src={item.thumbnail}
      className={
        round
          ? 'mx-auto aspect-square w-14 rounded-full'
          : 'aspect-[4/3] w-full rounded-xs'
      }
    />
    <p
      className={`line-clamp-2 text-xxsmall12 text-neutral-10 ${round ? 'text-center' : ''}`}
    >
      {item.title}
    </p>
  </div>
);

const SectionPreview = ({
  section,
  items,
}: {
  section: ProgramCategory;
  items: PublicCategoryTarget[];
}) => {
  const style = resolveStyle(section.displayType ?? 'AUTO', items);
  const shown = items.slice(0, MAX_CARDS);
  const rest = items.length - shown.length;

  return (
    <section className="flex flex-col gap-2">
      <div>
        {items.length > 0 && (
          <p className="text-xxsmall12 font-semibold text-primary">
            {eyebrowOf(items)}
          </p>
        )}
        <p className="text-xsmall16 font-bold text-neutral-0">
          {section.title}
        </p>
        {section.description && (
          <p className="text-xxsmall12 text-neutral-40">
            {section.description}
          </p>
        )}
      </div>
      {items.length === 0 ? (
        <div className="rounded-xs border border-dashed border-neutral-80 py-4 text-center text-xxsmall12 text-neutral-50">
          상품 없음 · 사이트에서는 이 섹션이 숨겨집니다
        </div>
      ) : style === 'FEATURED' ? (
        <div className="flex gap-3 rounded-xs bg-neutral-95 p-2">
          <Thumb
            src={items[0].thumbnail}
            className="aspect-[4/3] w-40 shrink-0 rounded-xs"
          />
          <p className="text-xsmall14 font-semibold text-neutral-10">
            {items[0].title}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-2">
          {shown.map((item) => (
            <SmallCard
              key={`${item.targetType}-${item.targetId}`}
              item={item}
              round={style === 'MENTOR'}
            />
          ))}
          {rest > 0 && (
            <div className="flex aspect-[4/3] items-center justify-center rounded-xs bg-neutral-95 text-xsmall14 text-neutral-40">
              +{rest}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

/**
 * 랜딩 페이지를 줄여 그린 모습. 공개 API 로 사이트와 같은 상품을 받아
 * 섹션마다 제목·설명과 카드 모양대로 작은 카드를 놓는다. 저장된 설정 기준이다
 */
const LandingPreview = ({
  group,
  mergeChallenges,
}: {
  group: ProgramCategoryGroup;
  mergeChallenges: boolean;
}) => {
  const sections = visibleSections(group);
  const { data: targets = [], isLoading } = usePublicCategoryTargets(
    sections.map((c) => c.id),
    mergeChallenges,
  );

  if (sections.length === 0)
    return (
      <p className="text-xsmall14 text-neutral-40">보이는 섹션이 없습니다.</p>
    );
  if (isLoading)
    return <p className="text-xsmall14 text-neutral-40">불러오는 중…</p>;

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-6 rounded-sm bg-white p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
      {sections.map((section) => (
        <SectionPreview
          key={section.id}
          section={section}
          items={targets.filter((t) => t.categoryIds.includes(section.id))}
        />
      ))}
    </div>
  );
};

export default LandingPreview;
