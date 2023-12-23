import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const usePagination = ({ sizePerPage }: { sizePerPage: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (page === 0) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', `${page}`);
    }
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  }, [page]);

  return { page, setPage, sizePerPage };
};

export default usePagination;
