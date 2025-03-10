import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavSubItemProps } from './NavSubItem';

interface SideNavItemProps {
  to: string;
  onClick?: () => void;
  children: string;
  target?: string;
  rel?: string;
  className?: string;
  hoverItem?: NavSubItemProps[];
  reloadDocument?: boolean;
}

const SideNavItem = ({
  to,
  onClick,
  children,
  target,
  rel,
  className,
  hoverItem,
  reloadDocument,
}: SideNavItemProps) => {
  const Wrapper = hoverItem ? 'div' : Link;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-col px-5">
      <Wrapper
        to={to}
        className={clsx(
          'flex w-full cursor-pointer justify-between rounded-xs px-2.5 py-3 text-neutral-30',
          hoverItem && open && 'bg-primary-5',
          className,
        )}
        onClick={() => {
          if (hoverItem) {
            setOpen(!open);
          } else if (onClick) {
            onClick();
          }
        }}
        {...(Wrapper === Link
          ? {
              reloadDocument,
              target,
              rel,
            }
          : {})}
      >
        <span className="text-1.125-bold">{children}</span>
      </Wrapper>
      {hoverItem && (
        <div
          className={`flex ${open ? 'max-h-screen' : 'max-h-0'} w-full transform flex-col gap-y-1.5 overflow-hidden duration-150`}
        >
          <div className="h-[7px]" />
          {hoverItem.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClick}
              className="flex w-full px-8 py-2 text-xsmall16 font-semibold text-neutral-20"
              reloadDocument={reloadDocument}
              target={target}
              rel={rel}
            >
              {item.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SideNavItem;
