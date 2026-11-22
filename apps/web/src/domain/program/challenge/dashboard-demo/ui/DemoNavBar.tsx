import clsx from 'clsx';
import { ReactNode } from 'react';

export type DemoView = 'dashboard' | 'my-mission';

interface Props {
  view: DemoView;
  onSelect: (view: DemoView) => void;
  /** 메뉴 아래에 붙는 안내 말풍선 */
  tip?: ReactNode;
}

const NAV_ITEMS: { label: string; view?: DemoView }[] = [
  { label: '대시보드', view: 'dashboard' },
  { label: '나의 미션', view: 'my-mission' },
];

/** 실제 NavBar 모양. 링크 대신 체험 안의 화면만 바꾼다. 체험에 필요 없는 메뉴는 뺐다. */
const DemoNavBar = ({ view, onSelect, tip }: Props) => (
  <nav className="relative w-full md:w-[180px] md:shrink-0 md:self-start">
    <ul className="flex h-[40px] flex-row gap-4 overflow-x-auto border-b bg-white px-5 py-2 scrollbar-hide md:h-auto md:flex-col md:gap-0 md:border-b-0 md:bg-transparent md:px-0 md:py-0">
      {NAV_ITEMS.map((item) => {
        const isActive = item.view === view;
        const itemView = item.view;

        return (
          <li key={item.label} className="flex-shrink-0 md:flex-shrink">
            <button
              type="button"
              onClick={() => itemView && onSelect(itemView)}
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
    {tip}
  </nav>
);

export default DemoNavBar;
