import CareerCard from '../../common/mypage/career/card/CareerCard';

const CareerGrowthSection = () => {
  return (
    <CareerCard
      title="커리어 성장"
      description="참여 중인 프로그램이 없어요."
      buttonText="프로그램 둘러보기"
      buttonHref="/programs"
      fullWidth
    />
  );
};

export default CareerGrowthSection;
