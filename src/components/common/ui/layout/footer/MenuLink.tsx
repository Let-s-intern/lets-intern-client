import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface MenuLinkProps {
  to: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  className?: string;
}

const MenuLink = ({ to, children, target, rel, className }: MenuLinkProps) => {
  return (
    <Link
      to={to}
      className={clsx('text-0.875-medium', className)}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
};

export default MenuLink;
