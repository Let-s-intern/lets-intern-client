import { useRouter } from 'next/navigation';
import CareerCard from '../../common/mypage/career/card/CareerCard';

const CareerPlanSection = () => {
  const router = useRouter();

  // TODO: 서버에서 받아올 데이터 (임시 하드코딩)
  const wishField = '디자인';
  const wishJob =
    'UX디자이너, 그래픽 디자이너, 그래픽 퍼포먼스 콘텐츠 디자이너';
  const wishIndustry = '';
  const wishCompany = '삼성, 아모레 퍼시픽, 카카오, 네이버, 토스, 쿠팡';

  // 데이터 존재 여부 확인
  const hasData = wishField || wishJob || wishIndustry || wishCompany;

  return (
    <CareerCard
      title="커리어 계획"
      labelOnClick={() => router.push('/mypage/career/plan')}
      body={
        hasData ? (
          <CareerPlanBody
            wishField={wishField}
            wishJob={wishJob}
            wishIndustry={wishIndustry}
            wishCompany={wishCompany}
          />
        ) : (
          <CareerCard.Empty
            description="아직 커리어 방향을 설정하지 않았어요."
            buttonText="커리어 계획하기"
            buttonHref="/mypage/career/plan"
            onClick={() => router.push('/mypage/career/plan')}
          />
        )
      }
    />
  );
};

export default CareerPlanSection;

interface CareerPlanBodyProps {
  wishField: string;
  wishJob: string;
  wishIndustry: string;
  wishCompany: string;
}

const CareerPlanBody = ({
  wishField,
  wishJob,
  wishIndustry,
  wishCompany,
}: CareerPlanBodyProps) => {
  // 희망 직군/직무 조합
  const jobRoleText = (() => {
    const parts: string[] = [];
    if (wishField) parts.push(wishField);
    if (wishJob) parts.push(wishJob);
    return parts.length > 0 ? parts.join(' / ') : null;
  })();

  return (
    <div className="flex flex-col gap-2">
      {/* 희망 직군/직무 */}

      <div className="flex flex-col gap-1">
        <span className="font-regular text-sm text-[#4138A3]">
          희망 직군 / 직무
        </span>
        <span className="truncate text-sm text-neutral-0">
          {jobRoleText || '미설정'}
        </span>
      </div>
      <div className="border-b border-[#EFEFEF]" />

      {/* 희망 산업 */}
      <div className="flex flex-col gap-1">
        <span className="font-regular text-sm text-[#4138A3]">희망 산업</span>
        <span className="truncate text-sm text-neutral-0">
          {wishIndustry || '미설정'}
        </span>
      </div>
      <div className="border-b border-[#EFEFEF]" />

      {/* 희망 기업 */}
      <div className="flex flex-col gap-1">
        <span className="font-regular text-sm text-[#4138A3]">희망 기업</span>
        <span className="truncate text-sm text-neutral-0">
          {wishCompany || '미설정'}
        </span>
      </div>
    </div>
  );
};
