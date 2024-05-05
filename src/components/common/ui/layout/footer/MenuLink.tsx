import { Link } from 'react-router-dom';

interface MenuLinkProps {
  to: string;
  children: React.ReactNode;
}

const MenuLink = ({ to, children }: MenuLinkProps) => {
  return (
    <Link to={to} className="text-1-medium">
      {children}
    </Link>
  );
};

export default MenuLink;
