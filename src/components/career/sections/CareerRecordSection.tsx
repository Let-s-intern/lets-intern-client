import { useRouter } from 'next/navigation';
import CareerCard from '../../common/mypage/career/card/CareerCard';

const CareerRecordSection = () => {
  const router = useRouter();
  return (
    <CareerCard
      title="커리어 기록"
      body={
        <CareerCard.Empty
          description="아직 등록된 커리어가 없어요"
          buttonText="커리어 기록하기"
          buttonHref="/mypage/career/record"
          onClick={() => router.push('/mypage/career/record')}
        />
      }
    />
  );
};

export default CareerRecordSection;
