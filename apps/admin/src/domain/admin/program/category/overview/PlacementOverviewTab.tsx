import type { ReactNode } from 'react';
import { siteUrl, WEB_MENU } from '../constants/webMenu';
import { MATCH_MODE_LABEL } from '../constants/wording';
import { usePublicCategoryTargets } from '../hooks/usePublicCategoryTargets';
import {
  displayTypeLabel,
  programCategoryTargetTypeLabel,
  type ProgramCategory,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import ExpandableLine from '../ui/ExpandableLine';
import {
  filterRowsOf,
  landingPagesOf,
  menuDestinationOf,
  menuEntriesTo,
  visibleSections,
  type FilterRow,
  type LandingPage,
  type MenuDestination,
} from '../utils/placementUtils';
import ProductExposureTable from './ProductExposureTable';

const SiteLink = ({ path }: { path: string }) => (
  <a
    href={siteUrl(path)}
    target="_blank"
    rel="noreferrer"
    className="shrink-0 text-xxsmall12 text-primary hover:underline"
  >
    사이트
  </a>
);

const Meta = ({ children }: { children: ReactNode }) => (
  <span className="ml-2 text-xxsmall12 text-neutral-40">{children}</span>
);

const Warn = ({ children }: { children: ReactNode }) => (
  <span className="ml-2 text-xxsmall12 font-semibold text-red-500">
    {children}
  </span>
);

const destinationText = (d: MenuDestination) => {
  switch (d.kind) {
    case 'direct':
      return `상품으로 바로 이동 (${programCategoryTargetTypeLabel[d.targetType]} #${d.targetId})`;
    case 'landing':
      return `/category/${d.slug}`;
    case 'missing':
      return `/category/${d.slug} · 랜딩 없음 ("준비 중" 화면)`;
  }
};

/** 랜딩 페이지 한 줄. 상품 수는 사이트와 같은 공개 조회로 센다 */
const LandingLine = ({
  page,
  groups,
}: {
  page: LandingPage;
  groups: ProgramCategoryGroup[];
}) => {
  const sections = visibleSections(page.group);
  const { data: targets = [] } = usePublicCategoryTargets(
    sections.map((c) => c.id),
    page.mergeChallenges,
  );
  const countOf = (c: ProgramCategory) =>
    targets.filter((t) => t.categoryIds.includes(c.id)).length;
  const emptyCount = sections.filter((c) => countOf(c) === 0).length;
  const entries = menuEntriesTo(groups, page.slug);

  return (
    <ExpandableLine
      summary={
        <>
          <span className="text-xsmall14 font-semibold text-neutral-0">
            /category/{page.slug}
          </span>
          <Meta>
            섹션 {sections.length} · 상품 {targets.length} · 메뉴{' '}
            {entries.length > 0 ? entries.join(', ') : '없음'}
          </Meta>
          {!page.group.isVisible && <Warn>숨김</Warn>}
          {emptyCount > 0 && <Warn>빈 섹션 {emptyCount}</Warn>}
        </>
      }
      aside={<SiteLink path={`/category/${page.slug}`} />}
    >
      <ol className="flex flex-col gap-0.5 text-xsmall14">
        {sections.map((c, i) => (
          <li key={c.id} className={countOf(c) === 0 ? 'text-red-500' : ''}>
            {i + 1}. {c.title}
            <Meta>
              {displayTypeLabel[c.displayType ?? 'AUTO']} · 상품 {countOf(c)}
              {countOf(c) === 0 ? ' · 비어 있어 사이트에서 숨김' : ''}
            </Meta>
          </li>
        ))}
      </ol>
    </ExpandableLine>
  );
};

const FilterLine = ({
  row,
  groups,
}: {
  row: FilterRow;
  groups: ProgramCategoryGroup[];
}) => {
  const buttons = row.group.categoryList.filter((c) => c.isVisible);
  const empty = buttons.filter((c) => c.programCount === 0).length;
  return (
    <ExpandableLine
      summary={
        <>
          <span className="text-xsmall14 font-semibold text-neutral-0">
            {row.group.title}
          </span>
          <Meta>
            버튼 {buttons.length} · 여러 개 고르면{' '}
            {MATCH_MODE_LABEL[row.matchMode]}
          </Meta>
          {!row.group.isVisible && <Warn>숨김</Warn>}
          {empty > 0 && <Warn>빈 버튼 {empty}</Warn>}
        </>
      }
    >
      <ul className="flex flex-col gap-0.5 text-xsmall14">
        {buttons.map((c) => (
          <li key={c.id} className={c.programCount === 0 ? 'text-red-500' : ''}>
            {c.title}
            <Meta>
              상품 {c.programCount}
              {c.directTargetType && c.directTargetId
                ? ` · ${destinationText({ kind: 'direct', targetType: c.directTargetType, targetId: c.directTargetId })}`
                : c.slug
                  ? ` · 메뉴에서 누르면 ${destinationText(menuDestinationOf(groups, c.slug))}`
                  : ''}
            </Meta>
          </li>
        ))}
      </ul>
    </ExpandableLine>
  );
};

const Block = ({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) => (
  <div>
    <h3 className="flex items-baseline gap-2 font-bold text-neutral-0">
      {title}
      {aside}
    </h3>
    <ul className="divide-y divide-neutral-90">{children}</ul>
  </div>
);

/** 노출 위치마다 실제로 무엇이 나가는지. 한 줄 요약부터 보고, 누르면 자세히 펼친다 */
const PlacementOverviewTab = ({
  groups,
}: {
  groups: ProgramCategoryGroup[];
}) => {
  const landings = landingPagesOf(groups);
  const filters = filterRowsOf(groups);
  const menuItems = WEB_MENU.flatMap((menu) =>
    menu.items.map((item) => ({
      ...item,
      group: menu.group,
      destination: menuDestinationOf(groups, item.slug),
    })),
  );
  const missingMenus = menuItems.filter(
    (m) => m.destination.kind === 'missing',
  ).length;

  return (
    <div className="mt-4 flex max-w-[960px] flex-col gap-8">
      <Block title={`카테고리 랜딩 페이지 ${landings.length}`}>
        {landings.map((page) => (
          <LandingLine
            key={`${page.group.id}:${page.placementIndex}`}
            page={page}
            groups={groups}
          />
        ))}
        {landings.length === 0 && (
          <li className="py-2 text-xsmall14 text-neutral-40">없음</li>
        )}
      </Block>

      <Block
        title={`전체 프로그램 필터 ${filters.length}줄`}
        aside={<SiteLink path="/program" />}
      >
        {filters.map((row) => (
          <FilterLine
            key={`${row.group.id}:${row.placementIndex}`}
            row={row}
            groups={groups}
          />
        ))}
        {filters.length === 0 && (
          <li className="py-2 text-xsmall14 text-neutral-40">없음</li>
        )}
      </Block>

      <Block title="그 밖에">
        <ExpandableLine
          summary={
            <>
              <span className="text-xsmall14 font-semibold text-neutral-0">
                GNB 메뉴 · 홈 고민 섹션
              </span>
              <Meta>항목 {menuItems.length} · 웹에 고정된 구조</Meta>
              {missingMenus > 0 && <Warn>랜딩 없음 {missingMenus}</Warn>}
            </>
          }
        >
          <ul className="flex flex-col gap-0.5 text-xsmall14">
            {menuItems.map((m) => (
              <li
                key={m.slug}
                className={
                  m.destination.kind === 'missing' ? 'text-red-500' : ''
                }
              >
                {m.group} › {m.label}
                <Meta>→ {destinationText(m.destination)}</Meta>
              </li>
            ))}
          </ul>
        </ExpandableLine>
        <ExpandableLine
          summary={
            <>
              <span className="text-xsmall14 font-semibold text-neutral-0">
                상품별 노출 위치
              </span>
              <Meta>상품 하나가 어느 페이지·섹션·필터 버튼에 나오는지</Meta>
            </>
          }
        >
          <ProductExposureTable groups={groups} />
        </ExpandableLine>
      </Block>
    </div>
  );
};

export default PlacementOverviewTab;
