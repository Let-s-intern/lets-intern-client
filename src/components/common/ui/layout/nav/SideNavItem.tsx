import { Link } from 'react-router-dom';

interface SideNavItemProps {
  to: string;
  onClick?: () => void;
  children: string;
  target?: string;
  rel?: string;
}

const SideNavItem = ({
  to,
  onClick,
  children,
  target,
  rel,
}: SideNavItemProps) => {
  return (
    <Link
      to={to}
      className="flex w-full cursor-pointer justify-between rounded-md bg-gray-100 px-7 py-5 text-neutral-30"
      onClick={onClick}
      target={target}
      rel={rel}
    >
      <span>{children}</span>
      <i>
        <img src="/icons/arrow-right.svg" alt="오른쪽 화살표" />
      </i>
    </Link>
  );
};

export default SideNavItem;
