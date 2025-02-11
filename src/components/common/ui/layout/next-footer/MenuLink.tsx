import clsx from 'clsx';
import Link from 'next/link';

interface MenuLinkProps {
  to: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  className?: string;
  /** React Router 로 인하여 임시 full reload 여부 */
  force?: boolean;
}

const MenuLink = ({
  to,
  children,
  target,
  rel,
  className,
  force,
}: MenuLinkProps) => {
  return (
    <Link
      href={to}
      className={clsx('text-0.875-medium w-fit', className)}
      target={target}
      rel={rel}
      onClick={(e) => {
        if (force) {
          e.preventDefault();
          window.location.href = to;
        }
      }}
    >
      {children}
    </Link>
  );
};

export default MenuLink;
