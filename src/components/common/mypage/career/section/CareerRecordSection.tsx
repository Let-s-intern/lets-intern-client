import CareerCard from '../card/CareerCard';

const CareerRecordSection = () => {
  return (
    <CareerCard
      title="커리어 기록"
      description="아직 등록된 커리어가 없어요"
      buttonText="커리어 기록하기"
      buttonHref="/mypage/career/record"
    />
  );
};

export default CareerRecordSection;
