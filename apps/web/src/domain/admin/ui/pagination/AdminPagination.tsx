import clsx from 'clsx';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

interface AdminPaginationProps {
  maxPage: number;
  className?: string;
  pageNum: number;
  setPageNum: (pageNum: number) => void;
}

const AdminPagination = ({
  maxPage,
  className,
  pageNum,
  setPageNum,
}: AdminPaginationProps) => {
  const offset = 2;

  const isPageInStart = pageNum < offset + 1;
  const isPageInEnd = pageNum > maxPage - offset;

  const isSmallPageList = maxPage <= offset * 2 + 1;

  const minOffset = isPageInStart ? offset + 1 - pageNum : 0;
  const maxOffset = isPageInEnd ? offset + pageNum - maxPage : 0;

  const pageList = [];

  for (let page = 1; page <= maxPage; page++) {
    if (
      page >= pageNum - offset - maxOffset &&
      page <= pageNum + offset + minOffset
    ) {
      pageList.push(page);
    }
  }

  const handlePageButtonClick = (page: number) => {
    setPageNum(page);
    window.scrollTo(0, 0);
  };

  const handleArrowLeftClick = () => {
    if (pageNum <= 1) return;
    setPageNum(pageNum - 1);
    window.scrollTo(0, 0);
  };

  const handleArrowRightClick = () => {
    if (pageNum + 1 > maxPage) return;
    setPageNum(pageNum + 1);
    window.scrollTo(0, 0);
  };

  const handleFirstButtonClick = () => {
    setPageNum(1);
    window.scrollTo(0, 0);
  };

  const handleLastButtonClick = () => {
    setPageNum(maxPage);
    window.scrollTo(0, 0);
  };

  return (
    <div
      className={clsx(
        'admin-pagination flex w-full items-center justify-center gap-4',
        className,
      )}
    >
      <span
        className="cursor-pointer text-xl"
        onClick={() => handleArrowLeftClick()}
      >
        <i>
          <RiArrowLeftSLine />
        </i>
      </span>
      {!isSmallPageList && !isPageInStart && pageNum !== offset + 1 && (
        <>
          <span className="cursor-pointer" onClick={handleFirstButtonClick}>
            1
          </span>
          {pageNum !== offset + 2 && <span>...</span>}
        </>
      )}
      <ul className="flex items-center gap-4">
        {pageList.map((page) => (
          <li
            key={page}
            className={clsx('cursor-pointer', {
              'font-medium text-indigo-600': page === pageNum,
            })}
            onClick={() => handlePageButtonClick(page)}
          >
            {page}
          </li>
        ))}
      </ul>
      {!isSmallPageList && !isPageInEnd && pageNum !== maxPage - offset && (
        <>
          {pageNum !== maxPage - (offset + 1) && <span>...</span>}
          <span className="cursor-pointer" onClick={handleLastButtonClick}>
            {maxPage}
          </span>
        </>
      )}
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
