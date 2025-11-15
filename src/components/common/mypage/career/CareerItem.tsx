import { UserCareerType } from '@/api/careerSchema';
import CareerCard from '@components/common/mypage/career/CareerCard';
import CareerForm from '@components/common/mypage/career/CareerForm';

interface CareerItemProps {
  career: UserCareerType;
  writeMode: boolean;
  handleCancel: () => void;
  handleSubmit: (data: UserCareerType) => void;
  handleEdit: (id: string) => void;
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
