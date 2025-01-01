import Polygon from '@/assets/icons/polygon.svg?react';
import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavSubItem, { NavSubItemProps } from './NavSubItem';

interface NavItemProps {
  to?: string;
  active?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  hoverItem?: NavSubItemProps[];
  isItemLoaded?: boolean;
}

const NavItem = ({
  to,
  active,
  as,
  children,
  hoverItem,
  isItemLoaded = true,
}: NavItemProps) => {
  const [hover, setHover] = useState(false);
  const Wrapper = as || Link;
  const style = {
    'text-1.125-bold text-neutral-0': active || hover,
    'text-1.125-medium text-neutral-60': !active && !hover,
  };

  return (
    <Wrapper
      to={to || '#'}
      className={clsx(
        style,
        'relative hidden h-full cursor-pointer items-center xl:flex',
      )}
    >
      {children}
      <div
        className="absolute left-0 top-0 z-30 w-full pt-[2.75rem] md:pt-[3.375rem] lg:pt-[3.75rem]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover && hoverItem && (
          <div className="flex w-full flex-col items-center drop-shadow-05">
            <Polygon className="absolute top-0 z-10 mx-auto h-[14px] w-5 text-white" />
            <div className="mt-[13px] flex w-full flex-col rounded-xs bg-white py-1">
              {!isItemLoaded ? (
                <div className="mx-auto text-xsmall16 font-normal text-neutral-35">
                  Loading...
                </div>
              ) : (
                hoverItem.map((item, idx) => (
                  <NavSubItem
                    key={item.to}
                    isLast={idx === hoverItem.length - 1}
                    {...item}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default NavItem;
