import CareerCard from '../card/CareerCard';

const CareerPlanSection = () => {
  return (
    <CareerCard
      title="커리어 계획"
      description="아직 커리어 방향을 설정하지 않았어요."
      buttonText="커리어 계획하기"
      buttonHref="/mypage/career/plan"
    />
  );
};

export default CareerPlanSection;
