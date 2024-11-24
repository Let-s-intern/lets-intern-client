import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface SideNavItemProps {
  to: string;
  onClick?: () => void;
  children: string;
  target?: string;
  rel?: string;
  className?: string;
}

const SideNavItem = ({
  to,
  onClick,
  children,
  target,
  rel,
  className,
}: SideNavItemProps) => {
  return (
    <Link
      to={to}
      className={clsx(
        'mx-5 flex w-full cursor-pointer justify-between rounded-md px-2.5 py-3 text-neutral-30',
        className,
      )}
      onClick={onClick}
      target={target}
      rel={rel}
    >
      <span className="text-1.125-bold">{children}</span>
    </Link>
  );
};

export default SideNavItem;
