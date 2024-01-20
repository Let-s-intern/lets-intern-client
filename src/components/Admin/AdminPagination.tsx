import { useSearchParams } from 'react-router-dom';
import cn from 'classnames';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

interface AdminPaginationProps {
  maxPage: number;
}

const AdminPagination = ({ maxPage }: AdminPaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageButtonClick = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', `${page}`);
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  };

  const handleArrowLeftClick = () => {
    const page = Number(searchParams.get('page')) || 1;
    if (page - 1 <= 0) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', `${page - 1}`);
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  };

  const handleArrowRightClick = () => {
    const page = Number(searchParams.get('page')) || 1;
    if (page + 1 > maxPage) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', `${page + 1}`);
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  };

  return (
    <div className="admin-pagination flex w-full items-center justify-center gap-4">
      <span
        className="cursor-pointer text-xl"
        onClick={() => handleArrowLeftClick()}
      >
        <i>
          <RiArrowLeftSLine />
        </i>
      </span>
      <ul className="flex items-center gap-4">
        {Array.from(Array(maxPage), (_, index) => index + 1).map((page) => (
          <li
            key={page}
            className={cn('cursor-pointer', {
              'font-medium text-[#4F46E5]':
                page === Number(searchParams.get('page')) ||
                (searchParams.get('page') === null && page === 1),
            })}
            onClick={() => handlePageButtonClick(page)}
          >
            {page}
          </li>
        ))}
      </ul>
      <span
        className="cursor-pointer text-xl"
        onClick={() => handleArrowRightClick()}
      >
        <i>
          <RiArrowRightSLine />
        </i>
      </span>
    </div>
  );
};

export default AdminPagination;
