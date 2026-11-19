import { useEffect, useRef } from 'react';
import type { PublicCategoryTarget } from '../../hooks/usePublicCategoryTargets';
import type { ProgramCategoryDisplayType } from '../../programCategoryApi';
import type { SiteMenu } from '../../utils/tagUtils';
import { getSectionEyebrow, getSectionKind } from '../utils/landingCard';
import MiniGnb from './MiniGnb';
import {
  BlogCard,
  FeaturedCard,
  MentorCard,
  PassFreeNotice,
  ProgramCard,
} from './PreviewCards';

/** 웹과 같다. 섹션 한 줄에 처음 보이는 카드 수 */
const PREVIEW_COUNT = 5;

export interface PreviewSectionData {
  id: number;
  title: string;
  description?: string | null;
  displayType?: ProgramCategoryDisplayType | null;
  targets: PublicCategoryTarget[];
}

/** 점검·상품 화면에서 짚어 보일 곳 */
export interface PreviewHighlight {
  sectionId?: number;
  target?: { targetType: string; targetId: number };
}

const isTarget = (t: PublicCategoryTarget, h?: PreviewHighlight['target']) =>
  Boolean(h) &&
  t.targetType === h?.targetType &&
  (t.targetId === h?.targetId ||
    (t as { mergedTargetIds?: number[] | null }).mergedTargetIds?.includes(
      h.targetId,
    ) === true);

/** 짚은 카드. 테두리와 "이 상품" 표시 */
const Marked = ({
  on,
  children,
}: {
  on: boolean;
  children: React.ReactNode;
}) =>
  on ? (
    <div
      data-highlight="target"
      className="relative rounded-xs outline outline-2 outline-offset-4 outline-primary"
    >
      <span className="absolute -top-3 left-2 z-10 rounded-full bg-primary px-2 py-0.5 text-xxsmall12 font-semibold text-white">
        이 상품
      </span>
      {children}
    </div>
  ) : (
    <>{children}</>
  );

const Section = ({
  section,
  highlight,
}: {
  section: PreviewSectionData;
  highlight?: PreviewHighlight;
}) => {
  const { targets } = section;
  const kind = getSectionKind(targets, section.displayType);
  // 짚은 상품이 뒤에 있으면 더보기를 연 것처럼 다 보인다
  const highlightIndex = targets.findIndex((t) =>
    isTarget(t, highlight?.target),
  );
  const visible =
    highlightIndex >= PREVIEW_COUNT ? targets : targets.slice(0, PREVIEW_COUNT);
  const marked =
    highlight?.sectionId === section.id ||
    (highlightIndex >= 0 && kind !== 'challenge') ||
    (kind === 'challenge' && highlightIndex === 0);
  return (
    <section
      data-highlight={marked ? 'section' : undefined}
      className={`py-14 ${marked ? '-mx-4 rounded-sm bg-primary/5 px-4 ring-2 ring-primary/40' : ''}`}
    >
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
            <Marked on={isTarget(targets[0], highlight?.target)}>
              <FeaturedCard target={targets[0]} />
            </Marked>
            <PassFreeNotice />
          </div>
        ) : (
          <ul className="grid grid-cols-5 gap-4">
            {visible.map((target) => (
              <li key={`${target.targetType}-${target.targetId}`}>
                <Marked on={isTarget(target, highlight?.target)}>
                  {kind === 'mentoring' ? (
                    <MentorCard target={target} />
                  ) : kind === 'blog' ? (
                    <BlogCard target={target} />
                  ) : (
                    <ProgramCard target={target} />
                  )}
                </Marked>
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
 * 위에는 메뉴 값으로 만든 GNB 드롭다운을 둔다. 수강생 후기와 웹 코드의 기본 상단 문구는 그리지 않는다.
 * highlight 가 있으면 그 섹션·상품을 칠하고 그 자리로 스크롤한다
 */
const LandingPreview = ({
  slug,
  title,
  heroTitle,
  heroDescription,
  menu,
  sections,
  highlight,
}: {
  slug: string;
  title: string;
  heroTitle?: string | null;
  heroDescription?: string | null;
  menu: SiteMenu;
  sections: PreviewSectionData[];
  highlight?: PreviewHighlight;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!highlight) return;
    const el =
      ref.current?.querySelector('[data-highlight="target"]') ??
      ref.current?.querySelector('[data-highlight="section"]');
    el?.scrollIntoView?.({ block: 'center' });
  }, [highlight, sections]);

  const item = menu.groups
    .flatMap((g) => g.items.map((i) => ({ ...i, group: g.label })))
    .find((i) => i.slug === slug);
  const tabs = sections.filter((s) => s.targets.length > 0);

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <MiniGnb menu={menu} slug={slug} />
      <div className="overflow-hidden rounded-sm border border-neutral-90 bg-white">
        <div className="mx-auto w-full max-w-[1120px] px-8 pb-10">
          <nav className="mt-6 text-xxsmall12 text-neutral-40">
            홈{item?.group && <span> › {item.group}</span>}
            <span className="font-semibold text-neutral-10">
              {' '}
              › {item?.label ?? title}
            </span>
          </nav>
          <header className="mt-14">
            <h1 className="whitespace-pre-line text-xxlarge32 font-bold text-neutral-0">
              {heroTitle || title}
            </h1>
            {heroDescription && (
              <p className="mt-3 whitespace-pre-line text-xsmall16 text-neutral-30">
                {heroDescription}
              </p>
            )}
            {!heroTitle && (
              <p className="mt-3 text-xxsmall12 text-neutral-50">
                상단 제목을 비워 두면 사이트에는 웹 기본 문구가 있으면 그것,
                없으면 분류 이름이 보여요.
              </p>
            )}
          </header>
          {tabs.length > 0 && (
            <nav className="mt-10 flex border-b border-neutral-80">
              {tabs.map((s, index) => (
                <span
                  key={s.id}
                  className={`-mb-px flex-1 whitespace-nowrap border-b-2 px-4 py-3 text-center text-xsmall16 ${
                    index === 0
                      ? 'border-neutral-0 font-semibold text-neutral-0'
                      : 'border-transparent text-neutral-30'
                  }`}
                >
                  {getSectionEyebrow(
                    s.targets,
                    getSectionKind(s.targets, s.displayType),
                  )}
                </span>
              ))}
            </nav>
          )}
          {sections.length === 0 ? (
            <p className="py-20 text-center text-xsmall14 text-neutral-40">
              보이는 섹션이 없습니다.
            </p>
          ) : (
            sections.map((s) => (
              <Section key={s.id} section={s} highlight={highlight} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPreview;
