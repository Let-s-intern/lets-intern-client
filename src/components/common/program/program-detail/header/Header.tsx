import { MdOutlineArrowBack } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleBackLinkClick = () => {
    navigate(-1);
  };

  return (
    <header className="flex items-center gap-3 py-5">
      <Link to="#" className="text-[1.5rem]" onClick={handleBackLinkClick}>
        <MdOutlineArrowBack />
      </Link>
      <h1 className="text-lg font-medium">
        인턴/신입 지원 챌린지 18기 최대글자는여기
      </h1>
    </header>
  );
};

export default Header;
