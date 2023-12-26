import { useSearchParams } from 'react-router-dom';
import cn from 'classnames';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import './AdminPagination.scss';

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
    <div className="admin-pagination">
      <span className="arrow" onClick={() => handleArrowLeftClick()}>
        <i>
          <RiArrowLeftSLine />
        </i>
      </span>
      <ul>
        {Array.from(Array(maxPage), (_, index) => index + 1).map((page) => (
          <li
            key={page}
            className={cn({
              ['active']:
                page === Number(searchParams.get('page')) ||
                (searchParams.get('page') === null && page === 1),
            })}
            onClick={() => handlePageButtonClick(page)}
          >
            {page}
          </li>
        ))}
      </ul>
      <span className="arrow" onClick={() => handleArrowRightClick()}>
        <i>
          <RiArrowRightSLine />
        </i>
      </span>
    </div>
  );
};

export default AdminPagination;
