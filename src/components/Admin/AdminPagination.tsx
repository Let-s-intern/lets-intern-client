import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import cn from 'classnames';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import './AdminPagination.scss';

interface AdminPaginationProps {
  currentPage: number;
  maxPage: number;
  marginTop?: number;
  setCurrentPage: (currentPage: number) => void;
}

const AdminPagination = ({
  maxPage,
  marginTop,
  currentPage,
  setCurrentPage,
}: AdminPaginationProps) => {
  const handlePageClicked = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="admin-pagination" style={{ marginTop: `${marginTop}rem` }}>
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
              ['active']: page === currentPage,
            })}
            onClick={() => handlePageClicked(page)}
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
