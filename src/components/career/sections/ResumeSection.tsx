import { useRouter } from 'next/navigation';
import CareerCard from '../../common/mypage/career/card/CareerCard';

const ResumeSection = () => {
  const router = useRouter();
  return (
    <CareerCard
      title="서류 정리"
      labelOnClick={() => router.push('/mypage/career/resume')}
      body={
        <CareerCard.Empty
          description="아직 등록된 서류가 없어요"
          buttonText="서류 정리하기"
          buttonHref="/mypage/career/resume"
          onClick={() => router.push('/mypage/career/resume')}
        />
      }
    />
  );
};

export default ResumeSection;
