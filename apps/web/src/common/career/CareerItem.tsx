import { CareerFormType, UserCareerType } from '@/api/career/careerSchema';
import CareerCard from '@/common/career/CareerCard';
import CareerForm from '@/common/career/CareerForm';

interface CareerItemProps {
  career: CareerFormType;
  writeMode: boolean;
  handleCancel: () => void;
  handleSubmit: (data: UserCareerType) => void;
  handleEdit: (id: number) => void;
}

/**
 * 커리어 조회 + 수정 토글 컨테이너
 */
const CareerItem = ({
  career,
  writeMode,
  handleCancel,
  handleSubmit,
  handleEdit,
}: CareerItemProps) => {
  return (
    <>
      {writeMode ? (
        <CareerForm
          initialCareer={career}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
        />
      ) : (
        <CareerCard career={career} handleEdit={handleEdit} />
      )}
    </>
  );
};

export default CareerItem;
