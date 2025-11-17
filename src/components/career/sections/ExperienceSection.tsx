import { useRouter } from 'next/navigation';
import CareerCard from '../../common/mypage/career/card/CareerCard';

const ExperienceSection = () => {
  const router = useRouter();

  // TODO: 서버에서 받아올 데이터 (임시 하드코딩)
  const experienceCount = 12;
  const coreCompetencies = [
    '데이터 분석',
    '데이터 분석데이터 분석',
    '데이터 분석 데이터 분석데이터 분석',
  ];

  // 데이터 존재 여부 확인
  const hasData = experienceCount > 0 || coreCompetencies.length > 0;

  return (
    <CareerCard
      title="경험 정리"
      labelOnClick={() => router.push('/mypage/career/experience')}
      body={
        hasData ? (
          <ExperienceBody
            experienceCount={experienceCount}
            coreCompetencies={coreCompetencies}
          />
        ) : (
          <CareerCard.Empty
            description="아직 정리된 경험이 없어요"
            buttonText="경험 정리하기"
            buttonHref="/mypage/career/experience"
            onClick={() => router.push('/mypage/career/experience')}
          />
        )
      }
    />
  );
};

export default ExperienceSection;

interface ExperienceBodyProps {
  experienceCount: number;
  coreCompetencies: string[];
}

const ExperienceBody = ({
  experienceCount,
  coreCompetencies,
}: ExperienceBodyProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* 지금까지 정리한 경험 */}
      <div className="flex flex-col gap-1">
        <span className="text-xxsmall12 font-normal text-[#4138A3]">
          지금까지 정리한 경험
        </span>
        <div className="flex items-baseline gap-1">
          <p className="text-2xl text-neutral-0">{experienceCount}</p>
          <p className="text-xl text-neutral-0">개</p>
        </div>
      </div>
      <div className="border-b border-[#EFEFEF]" />

      {/* 내 주요 핵심 역량 */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xxsmall12 font-normal text-[#4138A3]">
          내 주요 핵심 역량
        </span>
        <div className="flex flex-wrap gap-2">
          {coreCompetencies.map((competency, index) => (
            <span
              key={index}
              className="rounded-xxs bg-primary-10 px-2 py-1 text-xxsmall12 font-normal text-neutral-35"
            >
              {competency}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
