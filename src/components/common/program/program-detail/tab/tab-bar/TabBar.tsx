import clsx from 'clsx';

interface TabBarProps {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

const TabBar = ({ tabIndex, setTabIndex }: TabBarProps) => {
  return (
    <ul className="grid grid-cols-3">
      <li
        className={clsx(
          'info_cta flex cursor-pointer items-center justify-center border-b-2 px-3 py-4',
          {
            'border-primary text-primary': tabIndex === 0,
            'border-neutral-0 border-opacity-[16%] text-neutral-0 text-opacity-[74%]':
              tabIndex !== 0,
          },
        )}
        onClick={() => setTabIndex(0)}
      >
        상세정보
      </li>
      <li
        className={clsx(
          'review_cta flex cursor-pointer items-center justify-center border-b-2 px-3 py-4',
          {
            'border-primary text-primary': tabIndex === 1,
            'border-neutral-0 border-opacity-[16%] text-neutral-0 text-opacity-[74%]':
              tabIndex !== 1,
          },
        )}
        onClick={() => setTabIndex(1)}
      >
        후기
      </li>
      <li
        className={clsx(
          'faq_cta flex cursor-pointer items-center justify-center border-b-2 px-3 py-4',
          {
            'border-primary text-primary': tabIndex === 2,
            'border-neutral-0 border-opacity-[16%] text-neutral-0 text-opacity-[74%]':
              tabIndex !== 2,
          },
        )}
        onClick={() => setTabIndex(2)}
      >
        FAQ
      </li>
    </ul>
  );
};

export default TabBar;
