import { useRouter } from 'next/navigation';
import CareerCard from '../../common/mypage/career/card/CareerCard';

const ExperienceSection = () => {
  const router = useRouter();
  return (
    <CareerCard
      title="경험 정리"
      labelOnClick={() => router.push('/mypage/career/experience')}
      body={
        <CareerCard.Empty
          description="아직 정리된 경험이 없어요"
          buttonText="경험 정리하기"
          buttonHref="/mypage/career/experience"
          onClick={() => router.push('/mypage/career/experience')}
        />
      }
    />
  );
};

export default ExperienceSection;
