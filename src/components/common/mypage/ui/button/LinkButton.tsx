import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface LinkButtonProps {
  className?: string;
  children: React.ReactNode;
  to: string;
  target?: string;
  rel?: string;
}

const LinkButton = ({
  className,
  children,
  to,
  target,
  rel,
}: LinkButtonProps) => {
  return (
    <Link
      to={to}
      className={clsx(
        'flex w-full items-center justify-center gap-1 rounded-sm border-2 border-primary-xlight bg-neutral-100 px-5 py-1 text-xsmall14 font-semibold text-neutral-35 md:w-auto md:py-2 md:text-xsmall16',
        className,
      )}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
