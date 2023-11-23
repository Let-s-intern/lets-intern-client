import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="mb-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">프로그램 관리</h1>
      <Link
        to="/admin/programs/create"
        className="w-20 rounded bg-indigo-600 py-2 text-center font-medium text-white"
      >
        등록
      </Link>
    </header>
  );
};

export default Header;
