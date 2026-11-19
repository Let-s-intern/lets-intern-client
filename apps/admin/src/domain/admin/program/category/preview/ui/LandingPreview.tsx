import { WEB_MENU } from '../../constants/webMenu';
import {
  usePublicCategoryTargets,
  type PublicCategoryTarget,
} from '../../hooks/usePublicCategoryTargets';
import type {
  ProgramCategory,
  ProgramCategoryGroup,
} from '../../programCategoryApi';
import { visibleSections } from '../../utils/placementUtils';
import { getSectionEyebrow, getSectionKind } from '../utils/landingCard';
import {
  BlogCard,
  FeaturedCard,
  MentorCard,
  PassFreeNotice,
  ProgramCard,
} from './PreviewCards';

/** 웹과 같다. 섹션 한 줄에 처음 보이는 카드 수 */
const PREVIEW_COUNT = 5;

const Section = ({
  section,
  targets,
}: {
  section: ProgramCategory;
  targets: PublicCategoryTarget[];
}) => {
  const kind = getSectionKind(targets, section.displayType);
  const visible = targets.slice(0, PREVIEW_COUNT);
  return (
    <section className="py-14">
      <p className="text-xsmall14 font-semibold text-primary">
        {targets.length > 0 ? getSectionEyebrow(targets, kind) : ' '}
      </p>
      <div className="mt-1 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-medium24 font-bold text-neutral-0">
            {section.title}
          </h2>
          {section.description && (
            <p className="mt-1 text-xsmall16 text-neutral-30">
              {section.description}
            </p>
          )}
        </div>
        {kind !== 'challenge' && targets.length > PREVIEW_COUNT && (
          <span className="shrink-0 text-xsmall14 text-neutral-40">
            더보기 (+{targets.length - PREVIEW_COUNT})
          </span>
        )}
      </div>
      <div className="mt-6">
        {targets.length === 0 ? (
          <div className="rounded-xs border border-dashed border-neutral-80 py-8 text-center text-xsmall14 text-neutral-50">
            상품 없음 · 사이트에서는 이 섹션이 숨겨집니다
          </div>
        ) : kind === 'challenge' ? (
          <div className="flex flex-col gap-4">
            <FeaturedCard target={targets[0]} />
            <PassFreeNotice />
          </div>
        ) : (
          <ul className="grid grid-cols-5 gap-4">
            {visible.map((target) => (
              <li key={`${target.targetType}-${target.targetId}`}>
                {kind === 'mentoring' ? (
                  <MentorCard target={target} />
                ) : kind === 'blog' ? (
                  <BlogCard target={target} />
                ) : (
                  <ProgramCard target={target} />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

/**
 * 랜딩 페이지 미리보기. 웹 CategoryLanding·LandingSection 과 같은 구조로 그린다.
 * 상품은 사이트와 같은 공개 조회로 받는다. 웹에만 있는 머리 문구·수강생 후기는 그리지 않는다
 */
const LandingPreview = ({
  group,
  slug,
  mergeChallenges,
}: {
  group: ProgramCategoryGroup;
  slug: string;
  mergeChallenges: boolean;
}) => {
  const sections = visibleSections(group);
  const { data: targets = [], isLoading } = usePublicCategoryTargets(
    sections.map((c) => c.id),
    mergeChallenges,
  );
  const menu = WEB_MENU.flatMap((m) =>
    m.items.map((item) => ({ ...item, group: m.group })),
  ).find((item) => item.slug === slug);
  const withTargets = sections.map((section) => ({
    section,
    targets: targets.filter((t) => t.categoryIds.includes(section.id)),
  }));
  const tabs = withTargets.filter((s) => s.targets.length > 0);

  return (
    <div className="overflow-hidden rounded-sm border border-neutral-90 bg-white">
      <div className="mx-auto w-full max-w-[1120px] px-8 pb-10">
        <nav className="mt-6 text-xxsmall12 text-neutral-40">
          홈{menu && <span> › {menu.group}</span>}
          <span className="font-semibold text-neutral-10">
            {' '}
            › {menu?.label ?? group.title}
          </span>
        </nav>
        <header className="mt-14">
          <h1 className="text-xxlarge32 font-bold text-neutral-0">
            {group.title}
          </h1>
          <p className="mt-3 text-xxsmall12 text-neutral-50">
            사이트의 머리 문구는 웹 코드에 따로 있어 여기서는 노출 목록 이름으로
            보입니다.
          </p>
        </header>
        {tabs.length > 0 && (
          <nav className="mt-10 flex border-b border-neutral-80">
            {tabs.map(({ section, targets: t }, index) => (
              <span
                key={section.id}
                className={`-mb-px flex-1 whitespace-nowrap border-b-2 px-4 py-3 text-center text-xsmall16 ${
                  index === 0
                    ? 'border-neutral-0 font-semibold text-neutral-0'
                    : 'border-transparent text-neutral-30'
                }`}
              >
                {getSectionEyebrow(t, getSectionKind(t, section.displayType))}
              </span>
            ))}
          </nav>
        )}
        {isLoading ? (
          <p className="py-20 text-center text-xsmall14 text-neutral-40">
            불러오는 중…
          </p>
        ) : sections.length === 0 ? (
          <p className="py-20 text-center text-xsmall14 text-neutral-40">
            보이는 섹션이 없습니다.
          </p>
        ) : (
          withTargets.map(({ section, targets: t }) => (
            <Section key={section.id} section={section} targets={t} />
          ))
        )}
      </div>
    </div>
  );
};

export default LandingPreview;
