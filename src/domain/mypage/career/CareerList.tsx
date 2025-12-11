import { useGetUserCareerQuery } from '@/api/career';
import { UserCareerType } from '@/api/careerSchema';
import CareerItem from '@/domain/mypage/career/CareerItem';
import { DEFAULT_PAGE_INFO } from '@/domain/mypage/career/constants';
import MuiPagination from '@/domain/program/pagination/MuiPagination';
import { convertCareerApiToUiFormat } from '@/utils/career';
import { useState } from 'react';

interface CareerListProps {
  editingId: number | null;
  handleCancel: () => void;
  handleSubmit: (data: UserCareerType) => void;
  handleEdit: (id: number) => void;
}

const PAGE_SIZE = 10;

const CareerList = ({
  editingId,
  handleCancel,
  handleSubmit,
  handleEdit,
}: CareerListProps) => {
  const [page, setPage] = useState(1);

  const { data } = useGetUserCareerQuery({
    page,
    size: PAGE_SIZE,
  });

  const { userCareers, pageInfo } = data ?? {};

  const {
    pageNum: currentPage,
    pageSize,
    totalPages,
    totalElements,
  } = pageInfo ?? DEFAULT_PAGE_INFO;

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setPage(page);
  };

  return (
    <>
      {userCareers?.map((career) => (
        <CareerItem
          key={career.id}
          career={convertCareerApiToUiFormat(career)}
          writeMode={editingId === career.id}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          handleEdit={handleEdit}
        />
      ))}

      {totalPages > 1 && (
        <div className="mx-auto mt-6 w-fit">
          <MuiPagination
            page={currentPage + 1}
            onChange={handlePageChange}
            pageInfo={{
              pageNum: currentPage + 1,
              pageSize,
              totalElements,
              totalPages,
            }}
          />
        </div>
      )}
    </>
  );
};

export default CareerList;
