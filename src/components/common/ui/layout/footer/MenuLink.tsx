import { Link } from 'react-router-dom';

interface MenuLinkProps {
  to: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}

const MenuLink = ({ to, children, target, rel }: MenuLinkProps) => {
  return (
    <Link to={to} className="text-1-medium" target={target} rel={rel}>
      {children}
    </Link>
  );
};

export default MenuLink;
