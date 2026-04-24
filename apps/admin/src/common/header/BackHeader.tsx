import { twMerge } from '@/lib/twMerge';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineArrowBack } from 'react-icons/md';

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
  const navigate = useNavigate();

  const handleBackClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else if (!to) {
      e.preventDefault();
      navigate(-1);
    }
  };

  return (
    <header
      className={twMerge('flex items-center gap-4 py-5 md:py-6', className)}
    >
      {!hideBack && (
        <Link to={to ?? '#'} onClick={handleBackClick}>
          <MdOutlineArrowBack size={'1.5rem'} />
        </Link>
      )}

      <h1 className="text-small20 font-semibold">{children}</h1>
    </header>
  );
};

export default BackHeader;
