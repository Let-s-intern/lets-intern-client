import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  active?: boolean;
  to?: string;
}

const TabItem = ({ children, active, to }: Props) => {
  return (
    <li
      className={clsx({
        'border-b-2 border-zinc-600 font-semibold': active,
      })}
    >
      <Link to={to || '#'} className="block w-16 py-2 text-center">
        {children}
      </Link>
    </li>
  );
};

export default TabItem;
