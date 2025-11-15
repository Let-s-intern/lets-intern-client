import CareerCard from '../../common/mypage/career/card/CareerCard';

const DocumentSection = () => {
  return (
    <CareerCard
      title="서류 정리"
      description="아직 등록된 서류가 없어요"
      buttonText="서류 정리하기"
      buttonHref="/mypage/career/documents"
    />
  );
};

export default DocumentSection;
