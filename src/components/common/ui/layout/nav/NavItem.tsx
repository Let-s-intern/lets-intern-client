import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface NavItemProps {
  to?: string;
  active?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
}

const NavItem = ({ to, active, as, children }: NavItemProps) => {
  const Wrapper = as || Link;
  const style = {
    'text-1.125-bold text-neutral-0': active,
    'text-1.125-medium text-neutral-60': !active,
  };

  return (
    <Wrapper to={to || '#'} className={clsx(style, 'cursor-pointer')}>
      {children}
    </Wrapper>
  );
};

export default NavItem;
