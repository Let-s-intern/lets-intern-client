import type { SiteMenu } from '../../utils/placementUtils';

/** 사이트 GNB "프로그램 카테고리" 드롭다운을 펼친 모습. 지금 페이지를 칠한다 */
const MiniGnb = ({ menu, slug }: { menu: SiteMenu; slug: string }) => {
  const inMenu = menu.groups.some((g) => g.items.some((i) => i.slug === slug));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="w-fit rounded-xs border border-neutral-80 bg-white shadow-sm">
        <div className="border-b border-neutral-90 px-3 py-1.5 text-xsmall14 font-semibold text-neutral-0">
          프로그램 카테고리 ▾
        </div>
        <div className="flex gap-6 px-3 py-2">
          {menu.groups.map((g) => (
            <div key={g.label ?? '-'} className="flex flex-col gap-0.5">
              {g.label && (
                <span className="text-xxsmall12 text-neutral-50">
                  {g.label}
                </span>
              )}
              {g.items.map((item) => (
                <span
                  key={item.slug}
                  className={`whitespace-nowrap rounded-xxs px-1 text-xsmall14 ${
                    item.slug === slug
                      ? 'bg-primary/10 font-semibold text-primary'
                      : 'text-neutral-10'
                  }`}
                >
                  {item.label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xxsmall12 text-neutral-50">
        {menu.source === 'fallback'
          ? '아직 메뉴에 올린 랜딩이 없어 사이트에는 웹 고정 메뉴가 보여요.'
          : inMenu
            ? '사이트 메뉴는 이렇게 보여요.'
            : '이 페이지는 메뉴에 없어 주소로만 열려요.'}
      </p>
    </div>
  );
};

export default MiniGnb;
