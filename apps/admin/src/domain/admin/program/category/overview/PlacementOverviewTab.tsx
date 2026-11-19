import { siteUrl, WEB_MENU } from '../constants/webMenu';
import { MATCH_MODE_LABEL, MERGE_CHALLENGES_LABEL } from '../constants/wording';
import {
  programCategoryTargetTypeLabel,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import LandingPreview from '../ui/LandingPreview';
import {
  filterRowsOf,
  landingPagesOf,
  menuDestinationOf,
  menuEntriesTo,
  type MenuDestination,
} from '../utils/placementUtils';
import ProductExposureList from './ProductExposureList';

const linkClass = 'text-xsmall14 font-normal text-primary hover:underline';

const SiteLink = ({ path }: { path: string }) => (
  <a
    href={siteUrl(path)}
    target="_blank"
    rel="noreferrer"
    className={linkClass}
  >
    사이트에서 열기
  </a>
);

const destinationText = (d: MenuDestination) => {
  switch (d.kind) {
    case 'direct':
      return `상품 상세로 바로 이동 (${programCategoryTargetTypeLabel[d.targetType]} #${d.targetId})`;
    case 'landing':
      return `/category/${d.slug} 랜딩`;
    case 'missing':
      return `/category/${d.slug} · 랜딩 없음 ("준비 중" 화면)`;
  }
};

/** 노출 위치마다 실제로 무엇이 나가는지. 고치지 않고 보기만 한다 */
const PlacementOverviewTab = ({
  groups,
}: {
  groups: ProgramCategoryGroup[];
}) => {
  const landings = landingPagesOf(groups);
  const filters = filterRowsOf(groups);

  return (
    <div className="mt-4 flex flex-col gap-8">
      <div>
        <h3 className="mb-1 text-small18 font-bold">카테고리 랜딩 페이지</h3>
        {landings.length === 0 ? (
          <p className="text-xsmall14 text-neutral-40">
            랜딩 페이지가 없습니다.
          </p>
        ) : (
          <>
            <nav className="mb-3 flex flex-wrap gap-2 text-xsmall14">
              {landings.map((l) => (
                <a
                  key={`${l.group.id}-${l.slug}`}
                  href={`#landing-${l.slug}`}
                  className="rounded-xs border border-neutral-80 px-2 py-0.5 hover:bg-neutral-95"
                >
                  /category/{l.slug}
                </a>
              ))}
            </nav>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {landings.map((l) => {
                const entries = menuEntriesTo(groups, l.slug);
                return (
                  <section
                    key={`${l.group.id}-${l.slug}`}
                    id={`landing-${l.slug}`}
                    className="flex flex-col gap-2 rounded-sm border border-neutral-80 bg-white p-3"
                  >
                    <p className="font-semibold text-neutral-0">
                      /category/{l.slug}{' '}
                      <SiteLink path={`/category/${l.slug}`} />
                    </p>
                    <p className="text-xxsmall12 text-neutral-40">
                      {l.group.title}
                      {l.group.isVisible ? '' : ' · 숨김(사이트에 안 보임)'}
                      {' · '}
                      {MERGE_CHALLENGES_LABEL} {l.mergeChallenges ? '켬' : '끔'}
                    </p>
                    <p className="text-xxsmall12 text-neutral-30">
                      들어오는 메뉴:{' '}
                      {entries.length > 0
                        ? entries.join(', ')
                        : '없음 (주소로만 열림)'}
                    </p>
                    <LandingPreview
                      group={l.group}
                      mergeChallenges={l.mergeChallenges}
                    />
                  </section>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-small18 font-bold">
          전체 프로그램 필터 (/program) <SiteLink path="/program" />
        </h3>
        {filters.length === 0 ? (
          <p className="text-xsmall14 text-neutral-40">
            필터에 붙은 노출 목록이 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col gap-2 text-xsmall14">
            {filters.map(({ group, matchMode }) => (
              <li
                key={group.id}
                className="rounded-sm border border-neutral-80 bg-white p-2"
              >
                <p>
                  <span className="font-semibold">{group.title}</span>
                  <span className="text-neutral-40">
                    {' '}
                    · 여러 개 고르면 {MATCH_MODE_LABEL[matchMode]}
                    {group.isVisible ? '' : ' · 숨김'}
                  </span>
                </p>
                <ul className="mt-1 flex flex-wrap gap-1">
                  {group.categoryList
                    .filter((c) => c.isVisible)
                    .map((c) => (
                      <li
                        key={c.id}
                        className={`rounded-xs px-2 py-0.5 ${
                          c.programCount === 0
                            ? 'bg-red-50 text-red-500'
                            : 'bg-neutral-95 text-neutral-10'
                        }`}
                      >
                        {c.title} {c.programCount}
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="mb-1 text-small18 font-bold">GNB 메뉴 · 홈 고민 섹션</h3>
        <p className="mb-2 text-xsmall14 text-neutral-40">
          메뉴 구조는 웹에 고정돼 있습니다. 필터 버튼의 페이지 주소가 같고 바로
          이동할 상품이 있으면 상세로, 아니면 같은 주소의 랜딩으로 갑니다.
        </p>
        <ul className="flex flex-col gap-1 text-xsmall14">
          {WEB_MENU.map((menu) => (
            <li key={menu.group}>
              <span className="font-semibold">{menu.group}</span>
              <ul className="ml-4">
                {menu.items.map((item) => {
                  const d = menuDestinationOf(groups, item.slug);
                  return (
                    <li key={item.slug}>
                      {item.label}{' '}
                      <span
                        className={
                          d.kind === 'missing'
                            ? 'text-red-500'
                            : 'text-neutral-40'
                        }
                      >
                        → {destinationText(d)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <ProductExposureList groups={groups} />
    </div>
  );
};

export default PlacementOverviewTab;
