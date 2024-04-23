import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface NavItemProps {
  to?: string;
  active?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
}

const NavItem = ({ to, active, as, children }: NavItemProps) => {
  const className = clsx({
    'text-1.125-bold text-neutral-0': active,
    'text-1.125-medium text-neutral-60': !active && to,
  });
  const Element = as || Link;

  return (
    <Element to={to || '#'} className={`${className} cursor-pointer`}>
      {children}
    </Element>
  );
};

export default NavItem;
