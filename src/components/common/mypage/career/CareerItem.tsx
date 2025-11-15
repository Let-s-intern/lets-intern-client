import { UserCareerType } from '@/api/careerSchema';
import CareerCard from '@components/common/mypage/career/CareerCard';
import CareerForm from '@components/common/mypage/career/CareerForm';

interface CareerItemProps {
  career: UserCareerType;
  writeMode: boolean;
  handleCancel: () => void;
  handleSubmit: (data: UserCareerType) => void;
}

/**
 * 커리어 조회 + 수정 토글 컨테이너
 */
const CareerItem = ({
  career,
  writeMode,
  handleCancel,
  handleSubmit,
}: CareerItemProps) => {
  return (
    <>
      {writeMode ? (
        <CareerForm handleCancel={handleCancel} handleSubmit={handleSubmit} />
      ) : (
        <CareerCard career={career} />
      )}
    </>
  );
};

export default CareerItem;
