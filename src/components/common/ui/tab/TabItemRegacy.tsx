import { Link } from 'react-router-dom';

interface TabItemProps {
  to?: string;
  active?: boolean;
  children: React.ReactNode;
}

const TabItem = ({ to, active, children }: TabItemProps) => {
  if (active) {
    return (
      <Link
        to={to || '#'}
        className="cursor-pointer border-b-2 border-b-primary pb-1 font-medium text-primary"
      >
        {children}
      </Link>
    );
  }

  if (to) {
    return (
      <Link
        to={to}
        className="cursor-pointer pb-1 text-neutral-30 hover:border-b-2 hover:border-b-primary hover:text-primary"
      >
        {children}
      </Link>
    );
  }

  return (
    <div className="cursor-pointer pb-1 text-neutral-30 hover:border-b-2 hover:border-b-primary hover:text-primary">
      {children}
    </div>
  );
};

export default TabItem;
