import { useGetAllUserExperienceQuery } from '@/api/experience';
import LoadingContainer from '@/components/common/ui/loading/LoadingContainer';
import { getTopCoreCompetencies } from '@/domain/career-board/utils/experienceSummary';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CareerCard from '../../mypage/career/card/CareerCard';
import { useCareerDataStatus } from '../contexts/CareerDataStatusContext';

const ExperienceSection = () => {
  const router = useRouter();

  // API 호출
  const { data, isLoading } = useGetAllUserExperienceQuery(
    {
      experienceCategories: [],
      activityTypes: [],
      years: [],
      coreCompetencies: [],
    },
    'LATEST',
    { page: 1, size: 1000 },
  );
  const { setHasCareerData } = useCareerDataStatus();

  // 사용자가 직접 입력한 경험만 필터링
  const userExperiences =
    data?.userExperiences.filter((exp) => exp.isAddedByAdmin === false) ?? [];

  const experienceCount = userExperiences.length;
  const coreCompetencies = getTopCoreCompetencies(data?.userExperiences ?? []);

  // 데이터 존재 여부 확인
  const hasData = experienceCount > 0;

  useEffect(() => {
    if (hasData) {
      setHasCareerData(true);
    }
  }, [hasData, setHasCareerData]);

  if (isLoading) {
    return (
      <CareerCard
        title="경험 정리"
        labelOnClick={() => router.push('/mypage/career/experience')}
        body={<LoadingContainer text="경험 정리 조회 중" />}
      />
    );
  }

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
            height={179}
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
    <div className="flex h-[179px] flex-col gap-4">
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
