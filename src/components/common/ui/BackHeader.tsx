import { MdOutlineArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { twMerge } from '@/lib/twMerge';

interface BackHeaderProps {
  to?: string;
  children?: React.ReactNode;
  className?: string;
  hideBack?: boolean;
  onClick?: () => void;
}

const BackHeader = ({
  children,
  className,
  hideBack = false,
  to,
  onClick,
}: BackHeaderProps) => {
  return (
    <header className={twMerge('flex items-center gap-3 py-6', className)}>
      {!hideBack && (
        <Link to={to ?? '#'} onClick={onClick}>
          <MdOutlineArrowBack size={'1.5rem'} />
        </Link>
      )}

      <h1 className="text-small20 font-semibold">{children}</h1>
    </header>
  );
};

export default BackHeader;
