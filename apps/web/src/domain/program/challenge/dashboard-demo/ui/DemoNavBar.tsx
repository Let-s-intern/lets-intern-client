import clsx from 'clsx';

export type DemoView = 'dashboard' | 'my-mission';

interface Props {
  view: DemoView;
  onSelect: (view: DemoView) => void;
  onLocked: () => void;
}

const NAV_ITEMS: { label: string; view?: DemoView }[] = [
  { label: '대시보드', view: 'dashboard' },
  { label: '나의 미션', view: 'my-mission' },
  { label: '미션 피드백' },
  { label: '공지사항 / 챌린지 가이드' },
  { label: '1:1 문의' },
];

/** 실제 NavBar 모양. 링크 대신 체험 안의 화면만 바꾸고, 나머지 메뉴는 잠근다. */
const DemoNavBar = ({ view, onSelect, onLocked }: Props) => (
  <nav className="w-full md:w-[180px] md:shrink-0">
    <ul className="flex h-[40px] flex-row gap-4 overflow-x-auto border-b bg-white px-5 py-2 scrollbar-hide md:h-auto md:flex-col md:gap-0 md:border-b-0 md:bg-transparent md:px-0 md:py-0">
      {NAV_ITEMS.map((item) => {
        const isActive = item.view === view;
        const itemView = item.view;

        return (
          <li key={item.label} className="flex-shrink-0 md:flex-shrink">
            <button
              type="button"
              onClick={itemView ? () => onSelect(itemView) : onLocked}
              className={clsx(
                'flex w-full flex-row items-center whitespace-nowrap rounded-xxs text-left text-xsmall14 transition-colors md:h-[44px] md:px-3 md:text-xsmall16',
                isActive
                  ? 'font-semibold text-primary md:bg-primary-5'
                  : 'font-medium text-neutral-40',
              )}
            >
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default DemoNavBar;
