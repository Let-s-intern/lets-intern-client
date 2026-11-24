import { useState, type ReactNode } from 'react';
import { useAllProducts } from '../hooks/useAllProducts';
import { usePublicCategoryTargets } from '../hooks/usePublicCategoryTargets';
import {
  programCategoryTargetTypeLabel,
  useAllLandingsQuery,
  type ProgramCategoryGroup,
  type ProgramCategoryLanding,
} from '../programCategoryApi';
import ExpandableLine from '../ui/ExpandableLine';
import {
  duplicateTagTitles,
  filterRowsOf,
  legacyLandingGroupsOf,
  siteMenuOf,
  tagsOf,
} from '../utils/tagUtils';
import AutoFillPanel from './AutoFillPanel';
import MigrationPanel from './MigrationPanel';
import {
  NO_PLACE_REASON_LABEL,
  productsWithoutPlaceOf,
} from './noPlaceProducts';
import { productPlacesOf } from './productPlaces';
import VisualDialog, { type Visual } from './VisualDialog';

interface ProblemItem {
  key: string;
  content: ReactNode;
  visual?: Visual;
}

/** 문제 한 묶음. 줄을 누르면 그 화면을 문제 자리를 짚어 연다. 없으면 "없음" 한 줄 */
const Problem = ({
  title,
  hint,
  items,
  onOpen,
  extra,
}: {
  title: string;
  hint: string;
  items: ProblemItem[] | null;
  onOpen: (visual: Visual) => void;
  /** 제목 아래에 항상 붙는 조절 항목 */
  extra?: ReactNode;
}) => (
  <div className="py-3">
    <p className="text-xsmall14 font-semibold text-neutral-0">
      {title}
      <span
        className={`ml-2 text-xxsmall12 ${
          items && items.length > 0 ? 'text-red-500' : 'text-neutral-40'
        }`}
      >
        {items === null
          ? '확인 중…'
          : items.length > 0
            ? `${items.length}건`
            : '없음'}
      </span>
    </p>
    {extra}
    {items && items.length > 0 && (
      <>
        <p className="text-xxsmall12 text-neutral-40">{hint}</p>
        <ul className="mt-1 flex flex-col gap-0.5 text-xsmall14">
          {items.map((item) => (
            <li key={item.key}>
              {item.visual ? (
                <button
                  type="button"
                  onClick={() => onOpen(item.visual!)}
                  className="text-left text-neutral-10 underline-offset-2 hover:underline"
                >
                  {item.content}
                  <span className="ml-1 text-xxsmall12 text-primary">보기</span>
                </button>
              ) : (
                <span className="text-neutral-10">{item.content}</span>
              )}
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
);

/**
 * 노출을 켰는데 사이트 어디에도 안 나오는 상품. 보기만 한다.
 * 서버가 노출 여부를 아직 안 주면(옛 응답) 그리지 않는다
 */
const NoPlaceProblem = ({
  groups,
  landings,
  landingsLoading,
  onOpen,
}: {
  groups: ProgramCategoryGroup[];
  landings: Map<string, ProgramCategoryLanding | null>;
  landingsLoading: boolean;
  onOpen: (visual: Visual) => void;
}) => {
  const tags = tagsOf(groups);
  const { data: products } = useAllProducts();
  const { data: filterTargets } = usePublicCategoryTargets(
    tags.map(({ tag }) => tag.id),
    false,
  );
  const [includeEnded, setIncludeEnded] = useState(false);
  if (!products?.some((p) => p.isVisible != null)) return null;

  const items: ProblemItem[] | null =
    landingsLoading || !filterTargets
      ? null
      : productsWithoutPlaceOf({
          products,
          places: productPlacesOf(tags, landings, filterTargets),
          includeEnded,
          now: new Date(),
        }).map((row) => {
          const text = `${row.title} · ${programCategoryTargetTypeLabel[row.targetType]} · ${NO_PLACE_REASON_LABEL[row.reason]}`;
          return {
            key: row.key,
            content: row.editPath ? (
              <a
                href={row.editPath}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:underline"
              >
                {text}
              </a>
            ) : (
              text
            ),
          };
        });

  return (
    <Problem
      title="노출인데 사이트에 안 나오는 상품"
      hint="필터와 분류 페이지 어디에도 없어요. 줄을 누르면 수정 화면이 새 탭으로 열려요. 일괄 자동 태그로 채울 수 있는 상품은 위쪽에서 처리하세요."
      items={items}
      onOpen={onOpen}
      extra={
        <label className="mt-0.5 flex w-fit items-center gap-1 text-xxsmall12 text-neutral-30">
          <input
            type="checkbox"
            checked={includeEnded}
            onChange={(e) => setIncludeEnded(e.target.checked)}
          />
          종료된 상품도 보기
        </label>
      }
    />
  );
};

/** 상품별 노출 위치. 제목으로 찾고, 위치를 누르면 그 화면에서 상품을 짚어 보여 준다 */
const ProductPlaceList = ({
  groups,
  landings,
  onOpen,
}: {
  groups: ProgramCategoryGroup[];
  landings: Map<string, ProgramCategoryLanding | null>;
  onOpen: (visual: Visual) => void;
}) => {
  const tags = tagsOf(groups);
  const { data: filterTargets = [] } = usePublicCategoryTargets(
    tags.map(({ tag }) => tag.id),
    false,
  );
  const [keyword, setKeyword] = useState('');
  const rows = productPlacesOf(tags, landings, filterTargets).filter((p) =>
    p.title.toLowerCase().includes(keyword.trim().toLowerCase()),
  );
  return (
    <div className="flex flex-col gap-2">
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="상품 제목으로 찾기"
        className="w-72 rounded-xs border border-neutral-80 px-2 py-1 text-xsmall14"
      />
      <ul className="flex flex-col gap-1 text-xsmall14">
        {rows.slice(0, 30).map((p) => (
          <li key={p.key} className="flex flex-wrap items-baseline gap-1.5">
            <span className="font-semibold text-neutral-10">{p.title}</span>
            {p.places.map((place) => (
              <button
                key={place.label}
                type="button"
                onClick={() => onOpen(place.visual)}
                className="rounded-xs bg-neutral-95 px-1.5 text-xxsmall12 text-neutral-30 hover:text-primary"
              >
                {place.label}
              </button>
            ))}
          </li>
        ))}
        {rows.length > 30 && (
          <li className="text-xxsmall12 text-neutral-40">
            외 {rows.length - 30}개 · 제목으로 찾아 좁히세요
          </li>
        )}
        {rows.length === 0 && (
          <li className="text-neutral-40">해당하는 상품이 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

/** 점검. 손볼 것만 모으고, 누르면 사이트 모습으로 그 자리를 짚어 보여 준다 */
const CheckTab = ({ groups }: { groups: ProgramCategoryGroup[] }) => {
  const [visual, setVisual] = useState<Visual | null>(null);
  const tags = tagsOf(groups);
  const slugs = tags
    .map(({ tag }) => tag.slug)
    .filter((s): s is string => Boolean(s));
  const { bySlug, isLoading } = useAllLandingsQuery(slugs);
  const legacy = legacyLandingGroupsOf(groups);
  const legacySlugs = new Set(
    legacy.flatMap((g) => [
      g.slug,
      ...(g.placements ?? []).map((p) =>
        p.placementType === 'LANDING' ? p.slug : null,
      ),
    ]),
  );
  const menu = siteMenuOf(groups);

  const noSections: ProblemItem[] | null = isLoading
    ? null
    : tags
        .filter(({ tag }) => tag.slug && !bySlug.get(tag.slug))
        .map(({ tag }) => ({
          key: `n-${tag.id}`,
          content: `${tag.title} · /category/${tag.slug}`,
          visual: { kind: 'landing', tagId: tag.id },
        }));

  const emptySections: ProblemItem[] | null = isLoading
    ? null
    : tags.flatMap(({ tag }) => {
        const landing = tag.slug ? bySlug.get(tag.slug) : null;
        return (landing?.sectionList ?? [])
          .map((s, index) => ({ s, index }))
          .filter(({ s }) => s.targetList.length === 0)
          .map(({ s, index }) => ({
            key: `e-${s.id}`,
            content: `/category/${tag.slug} ${index + 1}. ${s.title}`,
            visual: {
              kind: 'landing',
              tagId: tag.id,
              highlight: { sectionId: s.id },
            },
          }));
      });

  const notInMenu: ProblemItem[] =
    menu.source === 'admin'
      ? tags
          .filter(
            ({ tag }) => tag.slug && !tag.showInMenu && bySlug.get(tag.slug),
          )
          .map(({ tag }) => ({
            key: `m-${tag.id}`,
            content: `${tag.title} · /category/${tag.slug}`,
            visual: { kind: 'landing', tagId: tag.id },
          }))
      : [];

  const brokenMenus: ProblemItem[] | null = isLoading
    ? null
    : menu.groups.flatMap((g) =>
        g.items
          .filter(
            (item) => !bySlug.get(item.slug) && !legacySlugs.has(item.slug),
          )
          .filter((item) => {
            const tag = tags.find((t) => t.tag.slug === item.slug)?.tag;
            return !(tag?.directTargetType && tag.directTargetId);
          })
          .map((item) => ({
            key: `g-${item.slug}`,
            content: `${g.label ? `${g.label} › ` : ''}${item.label} → /category/${item.slug}`,
            visual: { kind: 'menu', slug: item.slug },
          })),
      );

  const emptyButtons: ProblemItem[] = filterRowsOf(groups)
    .filter((row) => row.isVisible)
    .flatMap((row) =>
      row.categoryList
        .filter((c) => c.isVisible && c.programCount === 0)
        .map((c) => ({
          key: `b-${c.id}`,
          content: `${row.title} > ${c.title}`,
          visual: { kind: 'filter', tagId: c.id },
        })),
    );

  const duplicates: ProblemItem[] = duplicateTagTitles(groups).map((title) => ({
    key: `d-${title}`,
    content: `${title} (${tags
      .filter(({ tag }) => tag.title === title)
      .map(({ row }) => row.title)
      .join(', ')})`,
  }));

  return (
    <div className="mt-4 flex max-w-[960px] flex-col gap-6">
      {legacy.length > 0 && <MigrationPanel legacyCount={legacy.length} />}
      <AutoFillPanel groups={groups} />
      <div className="divide-y divide-neutral-90">
        <Problem
          title="섹션이 없는 분류 페이지"
          hint="사이트에는 예전 랜딩(있다면) 또는 준비 중 화면이 보여요. 분류 탭에서 기본 섹션을 만드세요."
          items={noSections}
          onOpen={setVisual}
        />
        <Problem
          title="상품이 없는 섹션"
          hint="사이트에서는 이 섹션이 통째로 숨겨져요. 조건을 넓히거나 상품에 분류를 달아 주세요."
          items={emptySections}
          onOpen={setVisual}
        />
        <Problem
          title="메뉴에 안 보이는 분류 페이지"
          hint="메뉴에 보이기가 꺼져 있어 주소로만 열려요. 페이지 설정에서 켜세요."
          items={notInMenu}
          onOpen={setVisual}
        />
        <Problem
          title="갈 곳이 없는 GNB·홈 메뉴"
          hint={`누르면 준비 중 화면이 나와요. (${menu.source === 'admin' ? '분류 메뉴 값' : '웹 고정 메뉴'} 기준)`}
          items={brokenMenus}
          onOpen={setVisual}
        />
        <Problem
          title="상품이 없는 필터 버튼"
          hint="/program 필터에서 눌러도 결과가 비어 있어요."
          items={emptyButtons}
          onOpen={setVisual}
        />
        <NoPlaceProblem
          groups={groups}
          landings={bySlug}
          landingsLoading={isLoading}
          onOpen={setVisual}
        />
        <Problem
          title="이름이 겹치는 분류"
          hint="같은 이름이 여러 줄에 있어요. 상품 수정 화면에서 헷갈릴 수 있어요."
          items={duplicates}
          onOpen={setVisual}
        />
      </div>

      <ul className="divide-y divide-neutral-90 border-t border-neutral-90">
        <ExpandableLine
          summary={
            <span className="text-xsmall14 font-semibold text-neutral-0">
              GNB·홈 메뉴가 가는 곳
              <span className="ml-2 text-xxsmall12 font-normal text-neutral-40">
                {menu.source === 'admin' ? '분류 메뉴 값' : '웹 고정 메뉴'}
              </span>
            </span>
          }
        >
          <ul className="flex flex-col gap-0.5 text-xsmall14">
            {menu.groups.flatMap((g) =>
              g.items.map((item) => (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() => setVisual({ kind: 'menu', slug: item.slug })}
                    className="hover:underline"
                  >
                    {g.label ? `${g.label} › ` : ''}
                    {item.label}
                    <span className="text-neutral-40">
                      {' '}
                      → /category/{item.slug}
                    </span>
                  </button>
                </li>
              )),
            )}
          </ul>
        </ExpandableLine>
      </ul>

      <div className="flex flex-col gap-2">
        <p className="text-xsmall14 font-semibold text-neutral-0">
          상품별 노출 위치
        </p>
        <ProductPlaceList
          groups={groups}
          landings={bySlug}
          onOpen={setVisual}
        />
      </div>

      {visual && (
        <VisualDialog
          visual={visual}
          groups={groups}
          onClose={() => setVisual(null)}
        />
      )}
    </div>
  );
};

export default CheckTab;
