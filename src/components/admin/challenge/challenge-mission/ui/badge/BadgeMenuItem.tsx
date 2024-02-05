import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  active?: boolean;
  to?: string;
}

const BadgeMenuItem = ({ children, active, to }: Props) => {
  return (
    <Link
      to={to || '#'}
      className={clsx(
        'rounded border border-neutral-700 px-4 py-[2px] text-xs',
        {
          'bg-neutral-700 text-white': active,
          'text-neutral-700': !active,
        },
      )}
    >
      {children}
    </Link>
  );
};

export default BadgeMenuItem;
