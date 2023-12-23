import { useSearchParams } from 'react-router-dom';
import cn from 'classnames';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import './AdminPagination.scss';

interface AdminPaginationProps {
  maxPage: number;
}

const AdminPagination = ({ maxPage }: AdminPaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageButtonClicked = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', `${page}`);
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  };

  return (
    <div className="admin-pagination">
      <span className="arrow">
        <i>
          <RiArrowLeftSLine />
        </i>
      </span>
      <ul>
        {Array.from(Array(maxPage + 1), (_, index) => index).map((page) => (
          <li
            key={page}
            className={cn({
              ['active']: page === Number(searchParams.get('page')),
            })}
            onClick={() => handlePageButtonClicked(page)}
          >
            {page}
          </li>
        ))}
      </ul>
      <span className="arrow">
        <i>
          <RiArrowRightSLine />
        </i>
      </span>
    </div>
  );
};

export default AdminPagination;
