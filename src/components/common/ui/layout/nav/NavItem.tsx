import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  to?: string;
  active?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  subChildren?: {
    to: string;
    children: string;
  }[];
}

const NavItem = ({ to, active, children, subChildren }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const style = {
    'text-1.125-bold text-neutral-0': active || (subChildren && isOpen),
    'text-1.125-medium text-neutral-60': !active || (subChildren && !isOpen),
  };

  useEffect(() => {
    if (!subChildren) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    subChildren && document.addEventListener('click', handleClickOutside);

    return () => {
      subChildren && document.removeEventListener('click', handleClickOutside);
    };
  }, [subChildren]);

  const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return subChildren ? (
    <div
      ref={ref}
      className={clsx(style, 'relative hidden cursor-pointer xl:block')}
      onClick={handleToggle}
    >
      {children}
      {subChildren && isOpen && (
        <div className="absolute left-0 top-[calc(100%+25px)] z-20 flex w-full flex-col rounded-md bg-white py-1 shadow-lg">
          {subChildren.map((child) => (
            <Link
              key={child.to}
              to={child.to}
              // target="_blank"
              // rel="noreferrer"
              className="px-4 py-2.5 text-xsmall16 font-medium text-neutral-60 hover:text-black"
            >
              {child.children}
            </Link>
          ))}
        </div>
      )}
    </div>
  ) : (
    <Link
      to={to || '#'}
      className={clsx(style, 'relative hidden cursor-pointer xl:block')}
    >
      {children}
    </Link>
  );
};

export default NavItem;
