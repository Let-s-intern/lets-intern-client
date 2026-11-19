import type { ReactNode } from 'react';
import { siteUrl } from '../constants/webMenu';
import { usePublicCategoryTargets } from '../hooks/usePublicCategoryTargets';
import {
  programCategoryTargetTypeLabel,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import ExpandableLine from '../ui/ExpandableLine';
import {
  filterRowsOf,
  landingPagesOf,
  menuDestinationOf,
  menuEntriesTo,
  siteMenuOf,
  visibleSections,
  type MenuDestination,
} from '../utils/placementUtils';
import ProductExposureTable from './ProductExposureTable';

const destinationText = (d: MenuDestination) => {
  switch (d.kind) {
    case 'direct':
      return `상품으로 바로 이동 (${programCategoryTargetTypeLabel[d.targetType]} #${d.targetId})`;
    case 'landing':
      return `/category/${d.slug}`;
    case 'missing':
      return `/category/${d.slug} · 랜딩 없음`;
  }
};

/** 문제 한 묶음. 없으면 "없음" 한 줄로 접힌다 */
const Problem = ({
  title,
  hint,
  items,
}: {
  title: string;
  hint: string;
  items: { key: string; content: ReactNode }[] | null;
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
    {items && items.length > 0 && (
      <>
        <p className="text-xxsmall12 text-neutral-40">{hint}</p>
        <ul className="mt-1 flex flex-col gap-0.5 text-xsmall14 text-neutral-10">
          {items.map((item) => (
            <li key={item.key}>{item.content}</li>
          ))}
        </ul>
      </>
    )}
  </div>
);

/**
 * 점검. 화면을 다 펼쳐 보이지 않고 손봐야 할 것만 모은다.
 * 각 페이지의 모습은 랜딩 탭의 미리보기에서 본다
 */
const CheckTab = ({ groups }: { groups: ProgramCategoryGroup[] }) => {
  const landings = landingPagesOf(groups).filter((l) => l.group.isVisible);
  // 비었는지만 보면 되므로 챌린지는 묶어서 한 번에 조회한다
  const landingSections = landings.flatMap((l) =>
    visibleSections(l.group).map((section) => ({ page: l, section })),
  );
  const { data: targets, isLoading } = usePublicCategoryTargets(
    [...new Set(landingSections.map((s) => s.section.id))],
    true,
  );
  const filled = new Set((targets ?? []).flatMap((t) => t.categoryIds));
  const emptySections =
    isLoading && landingSections.length > 0
      ? null
      : landingSections
          .filter((s) => !filled.has(s.section.id))
          .map(({ page, section }) => ({
            key: `${page.slug}-${section.id}`,
            content: (
              <>
                /category/{page.slug} › {section.title}
              </>
            ),
          }));

  const siteMenu = siteMenuOf(groups);
  // 메뉴에 보이기를 끈 랜딩. 아직 아무것도 안 켰으면 웹 고정 메뉴 기준으로 본다
  const noMenuPages = landings
    .filter((l) =>
      siteMenu.source === 'admin'
        ? !(l.group.placements ?? [])[l.placementIndex]?.showInMenu
        : menuEntriesTo(groups, l.slug).length === 0,
    )
    .map((l) => ({
      key: l.slug,
      content: (
        <>
          /category/{l.slug}{' '}
          <a
            href={siteUrl(`/category/${l.slug}`)}
            target="_blank"
            rel="noreferrer"
            className="text-xxsmall12 text-primary hover:underline"
          >
            사이트
          </a>
        </>
      ),
    }));

  const menuItems = siteMenu.groups.flatMap((menu) =>
    menu.items.map((item) => ({
      ...item,
      group: menu.label,
      destination: menuDestinationOf(groups, item.slug),
    })),
  );
  const brokenMenus = menuItems
    .filter((m) => m.destination.kind === 'missing')
    .map((m) => ({
      key: m.slug,
      content: (
        <>
          {m.group ? `${m.group} › ` : ''}
          {m.label}
          <span className="text-neutral-40"> → /category/{m.slug}</span>
        </>
      ),
    }));

  const emptyButtons = filterRowsOf(groups)
    .filter((r) => r.group.isVisible)
    .flatMap((r) =>
      r.group.categoryList
        .filter((c) => c.isVisible && c.programCount === 0)
        .map((c) => ({
          key: `${r.group.id}-${c.id}`,
          content: (
            <>
              {r.group.title} › {c.title}
            </>
          ),
        })),
    );

  return (
    <div className="mt-4 flex max-w-[960px] flex-col gap-6">
      <div className="divide-y divide-neutral-90">
        <Problem
          title="상품이 없는 랜딩 섹션"
          hint="사이트에서는 이 섹션이 통째로 숨겨집니다. 상품 수정 화면의 노출 분류에서 연결하세요."
          items={emptySections}
        />
        <Problem
          title="메뉴에 안 보이는 랜딩 페이지"
          hint={
            siteMenu.source === 'admin'
              ? '"메뉴에 보이기"가 꺼져 있어 주소로만 열립니다. 랜딩 탭의 페이지 설정에서 켜세요.'
              : '아직 메뉴에 올린 랜딩이 없어 사이트는 웹 고정 메뉴를 씁니다. 그 메뉴에 이 주소가 없습니다.'
          }
          items={noMenuPages}
        />
        <Problem
          title="랜딩이 없는 GNB·홈 메뉴"
          hint={
            '누르면 "준비 중" 화면이 나옵니다. 이 주소로 랜딩 페이지를 붙이거나 필터 버튼에 바로 이동 상품을 정하세요.'
          }
          items={siteMenu.source === 'fallback' ? brokenMenus : []}
        />
        <Problem
          title="상품이 없는 필터 버튼"
          hint="전체 프로그램 필터에서 눌러도 결과가 비어 있습니다."
          items={emptyButtons}
        />
      </div>

      <ul className="divide-y divide-neutral-90 border-t border-neutral-90">
        <ExpandableLine
          summary={
            <>
              <span className="text-xsmall14 font-semibold text-neutral-0">
                GNB·홈 메뉴가 가는 곳
              </span>
              <span className="ml-2 text-xxsmall12 text-neutral-40">
                {siteMenu.source === 'admin'
                  ? '어드민 메뉴 값'
                  : '웹 고정 메뉴'}
              </span>
            </>
          }
        >
          <ul className="flex flex-col gap-0.5 text-xsmall14">
            {menuItems.map((m) => (
              <li key={m.slug}>
                {m.group ? `${m.group} › ` : ''}
                {m.label}
                <span
                  className={
                    m.destination.kind === 'missing'
                      ? 'text-red-500'
                      : 'text-neutral-40'
                  }
                >
                  {' '}
                  → {destinationText(m.destination)}
                </span>
              </li>
            ))}
          </ul>
        </ExpandableLine>
      </ul>

      <div className="flex flex-col gap-2">
        <p className="text-xsmall14 font-semibold text-neutral-0">
          상품별 노출 위치
        </p>
        <ProductExposureTable groups={groups} />
      </div>
    </div>
  );
};

export default CheckTab;
