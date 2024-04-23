import { Link } from 'react-router-dom';

interface NavItemProps {
  to?: string;
  active?: boolean;
  children: React.ReactNode;
}

const NavItem = ({ to, active, children }: NavItemProps) => {
  if (active) {
    return (
      <Link
        to={to || '#'}
        className="text-1.125-bold cursor-pointer text-neutral-0 "
      >
        {children}
      </Link>
    );
  }

  if (to) {
    return (
      <Link
        to={to}
        className="text-1.125-medium cursor-pointer text-neutral-60 "
      >
        {children}
      </Link>
    );
  }

  return (
    <div className="text-1.125-medium cursor-pointer text-neutral-60">
      {children}
    </div>
  );
};

export default NavItem;
