import { twMerge } from '@/lib/twMerge';

interface TabBarProps {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

const ListItem = ({
  tabIndex,
  index,
  children,
  onClick,
  gtmId,
}: {
  tabIndex: number;
  index: number;
  children: React.ReactNode;
  onClick: () => void;
  gtmId: string;
}) => {
  return (
    <li
      className={twMerge(
        gtmId,
        'flex cursor-pointer select-none items-center justify-center border-b-2 border-neutral-0 border-opacity-[16%] px-3 py-4 text-xsmall16 font-medium text-neutral-0/[74%] transition',
        tabIndex === index && 'border-primary font-semibold text-primary',
      )}
      onClick={onClick}
    >
      {children}
    </li>
  );
};

const TabBar = ({ tabIndex, setTabIndex }: TabBarProps) => {
  return (
    <ul className="grid grid-cols-3">
      <ListItem
        tabIndex={tabIndex}
        index={0}
        onClick={() => setTabIndex(0)}
        gtmId="info_cta"
      >
        상세정보
      </ListItem>
      <ListItem
        tabIndex={tabIndex}
        index={1}
        onClick={() => setTabIndex(1)}
        gtmId="review_cta"
      >
        후기
      </ListItem>
      <ListItem
        tabIndex={tabIndex}
        index={2}
        onClick={() => setTabIndex(2)}
        gtmId="faq_cta"
      >
        FAQ
      </ListItem>
    </ul>
  );
};

export default TabBar;
