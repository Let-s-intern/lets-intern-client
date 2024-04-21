import { Link } from 'react-router-dom';

interface TabItemProps {
  to?: string;
  active?: boolean;
  children: React.ReactNode;
}

const NavItem = ({ to, active, children }: TabItemProps) => {
  if (active) {
    return (
      <Link
        to={to || '#'}
        className="cursor-pointer text-lg font-bold text-neutral-0 "
      >
        {children}
      </Link>
    );
  }

  if (to) {
    return (
      <Link
        to={to}
        className="cursor-pointer text-lg font-medium text-neutral-60 "
      >
        {children}
      </Link>
    );
  }

  return (
    <div className="cursor-pointer text-lg font-medium text-neutral-60">
      {children}
    </div>
  );
};

export default NavItem;
