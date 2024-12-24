import { twMerge } from '@/lib/twMerge';
import { MdOutlineArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';

interface HeaderProps {
  to?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Header = ({ children, className, to, onClick }: HeaderProps) => {
  return (
    <header className={twMerge('my-6 flex items-center gap-3', className)}>
      <Link to={to ?? '#'} onClick={onClick}>
        <MdOutlineArrowBack size={'1.5rem'} />
      </Link>

      <h1 className="text-small20 font-semibold">{children}</h1>
    </header>
  );
};

export default Header;
