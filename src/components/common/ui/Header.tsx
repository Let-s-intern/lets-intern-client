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
    <header className={twMerge('my-5 flex items-center gap-3', className)}>
      {to && (
        <Link to={to} className="text-[1.5rem]" onClick={onClick}>
          <MdOutlineArrowBack />
        </Link>
      )}
      <h1 className="text-lg font-medium">{children}</h1>
    </header>
  );
};

export default Header;
