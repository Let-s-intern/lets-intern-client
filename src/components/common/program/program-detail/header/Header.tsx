import { twMerge } from '@/lib/twMerge';
import { MdOutlineArrowBack } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  programTitle: string;
  className?: string;
}

const Header = ({ programTitle, className }: HeaderProps) => {
  const navigate = useNavigate();

  const handleBackLinkClick = () => {
    navigate(-1);
  };

  return (
    <header className={twMerge('my-5 flex items-center gap-3', className)}>
      <Link to="#" className="text-[1.5rem]" onClick={handleBackLinkClick}>
        <MdOutlineArrowBack />
      </Link>
      <h1 className="text-lg font-medium">{programTitle}</h1>
    </header>
  );
};

export default Header;
