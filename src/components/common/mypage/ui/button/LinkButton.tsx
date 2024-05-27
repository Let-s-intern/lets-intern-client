import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface LinkButtonProps {
  className?: string;
  children: React.ReactNode;
  to: string;
}

const LinkButton = ({ className, children, to }: LinkButtonProps) => {
  return (
    <Link
      to={to}
      className={clsx(
        'flex items-center justify-center gap-1 rounded-sm border-2 border-primary bg-neutral-100 px-5 py-2 font-semibold text-primary-dark',
        className,
      )}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
