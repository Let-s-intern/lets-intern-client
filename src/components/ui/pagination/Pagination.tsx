import clsx from 'clsx';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

interface AdminPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  maxPage: number;
  className?: string;
}

const Pagination = ({
  currentPage,
  setCurrentPage,
  maxPage,
  className,
}: AdminPaginationProps) => {
  const offset = 2;

  const isPageInStart = currentPage < offset + 1;
  const isPageInEnd = currentPage > maxPage - offset;

  const isSmallPageList = maxPage <= offset * 2 + 1;

  const minOffset = isPageInStart ? offset + 1 - currentPage : 0;
  const maxOffset = isPageInEnd ? offset + currentPage - maxPage : 0;

  let pageList = [];

  for (let pageNum = 1; pageNum <= maxPage; pageNum++) {
    if (
      pageNum >= currentPage - offset - maxOffset &&
      pageNum <= currentPage + offset + minOffset
    ) {
      pageList.push(pageNum);
    }
  }

  const handlePageButtonClick = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo(0, 0);
  };

  const handleArrowLeftClick = () => {
    if (currentPage <= 1) return;
    setCurrentPage(currentPage - 1);
    window.scrollTo(0, 0);
  };

  const handleArrowRightClick = () => {
    if (currentPage + 1 > maxPage) return;
    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
  };

  const handleFirstButtonClick = () => {
    setCurrentPage(1);
    window.scrollTo(0, 0);
  };

  const handleLastButtonClick = () => {
    setCurrentPage(maxPage);
    window.scrollTo(0, 0);
  };

  return (
    <div
      className={clsx(
        'flex w-full items-center justify-center gap-4 font-pretendard',
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
        {pageList.map((pageNum) => (
          <li
            key={pageNum}
            className={clsx('cursor-pointer', {
              'font-medium text-indigo-600': pageNum === currentPage,
            })}
            onClick={() => handlePageButtonClick(pageNum)}
          >
            {pageNum}
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

export default Pagination;
