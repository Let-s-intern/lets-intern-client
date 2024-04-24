import { useSearchParams } from 'react-router-dom';
import cn from 'classnames';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

interface AdminPaginationProps {
  maxPage: number;
  className?: string;
}

const AdminPagination = ({ maxPage, className }: AdminPaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  const offset = 2;

  const isPageInStart = currentPage < offset + 1;
  const isPageInEnd = currentPage > maxPage - offset;

  const isSmallPageList = maxPage <= offset * 2 + 1;

  const minOffset = isPageInStart ? offset + 1 - currentPage : 0;
  const maxOffset = isPageInEnd ? offset + currentPage - maxPage : 0;

  let pageList = [];

  for (let page = 1; page <= maxPage; page++) {
    if (
      page >= currentPage - offset - maxOffset &&
      page <= currentPage + offset + minOffset
    ) {
      pageList.push(page);
    }
  }

  const handlePageButtonClick = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', `${page}`);
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  };

  const handleArrowLeftClick = () => {
    if (currentPage <= 1) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', `${currentPage - 1}`);
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  };

  const handleArrowRightClick = () => {
    if (currentPage + 1 > maxPage) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', `${currentPage + 1}`);
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  };

  const handleFirstButtonClick = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  };

  const handleLastButtonClick = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', `${maxPage}`);
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  };

  return (
    <div
      className={cn(
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
      {!isSmallPageList && !isPageInStart && currentPage !== offset + 1 && (
        <>
          <span className="cursor-pointer" onClick={handleFirstButtonClick}>
            1
          </span>
          {currentPage !== offset + 2 && <span>...</span>}
        </>
      )}
      <ul className="flex items-center gap-4">
        {pageList.map((page) => (
          <li
            key={page}
            className={cn('cursor-pointer', {
              'font-medium text-indigo-600':
                page === Number(searchParams.get('page')) ||
                (searchParams.get('page') === null && page === 1),
            })}
            onClick={() => handlePageButtonClick(page)}
          >
            {page}
          </li>
        ))}
      </ul>
      {!isSmallPageList && !isPageInEnd && currentPage !== maxPage - offset && (
        <>
          {currentPage !== maxPage - (offset + 1) && <span>...</span>}
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
