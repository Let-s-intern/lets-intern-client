import { useRouter } from 'next/navigation';
import CareerCard from '../../common/mypage/career/card/CareerCard';

const CareerGrowthSection = () => {
  const router = useRouter();
  return (
    <CareerCard
      title="커리어 성장"
      labelOnClick={() => router.push('/mypage/application')}
      body={
        <CareerCard.Empty
          description="참여 중인 프로그램이 없어요."
          buttonText="프로그램 둘러보기"
          buttonHref="/program"
          onClick={() => router.push('/program')}
        />
      }
    />
  );
};

export default CareerGrowthSection;
