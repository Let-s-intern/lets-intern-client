'use client';

import { allUserExperienceQueryOptions } from '@/api/experience/experience';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { getTopCoreCompetencies } from '@/domain/career-board/utils/experienceSummary';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CareerCard from '../../mypage/career/card/CareerCard';
import { useCareerDataStatus } from '../contexts/CareerDataStatusContext';
import { SectionErrorFallback } from '../ui/SectionErrorFallback';

const TITLE = '경험 정리';
const HREF = '/mypage/career/experience';

const ExperienceSection = () => {
  const router = useRouter();

  return (
    <AsyncBoundary
      pendingFallback={
        <CareerCard
          title={TITLE}
          labelOnClick={() => router.push(HREF)}
          body={<LoadingContainer text="경험 정리 조회 중" />}
        />
      }
      rejectedFallback={({ resetErrorBoundary }) => (
        <CareerCard
          title={TITLE}
          labelOnClick={() => router.push(HREF)}
          body={<SectionErrorFallback onRetry={resetErrorBoundary} />}
        />
      )}
    >
      <ExperienceContent />
    </AsyncBoundary>
  );
};

export default ExperienceSection;

const ExperienceContent = () => {
  const router = useRouter();

  const { data } = useSuspenseQuery(
    allUserExperienceQueryOptions(
      {
        experienceCategories: [],
        activityTypes: [],
        years: [],
        coreCompetencies: [],
      },
      'LATEST',
      { page: 1, size: 1000 },
    ),
  );
  const { setHasCareerData } = useCareerDataStatus();

  const userExperiences =
    data?.userExperiences.filter((exp) => exp.isAddedByAdmin === false) ?? [];

  const experienceCount = userExperiences.length;
  const coreCompetencies = getTopCoreCompetencies(data?.userExperiences ?? []);

  const hasData = experienceCount > 0;

  useEffect(() => {
    if (hasData) {
      setHasCareerData(true);
    }
  }, [hasData, setHasCareerData]);

  return (
    <CareerCard
      title={TITLE}
      labelOnClick={() => router.push(HREF)}
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
            buttonHref={HREF}
            onClick={() => router.push(HREF)}
          />
        )
      }
    />
  );
};

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
      <div className="flex flex-col gap-1">
        <span className="text-xxsmall12 font-normal text-[#4138A3]">
          지금까지 정리한 경험
        </span>
        <div className="flex items-baseline gap-1">
          <p className="text-neutral-0 text-2xl">{experienceCount}</p>
          <p className="text-neutral-0 text-xl">개</p>
        </div>
      </div>
      <div className="border-b border-[#EFEFEF]" />

      <div className="flex flex-col gap-2.5">
        <span className="text-xxsmall12 font-normal text-[#4138A3]">
          내 주요 핵심 역량
        </span>
        <div className="flex flex-wrap gap-2">
          {coreCompetencies.map((competency, index) => (
            <span
              key={index}
              className="rounded-xxs bg-primary-10 text-xxsmall12 text-neutral-35 px-2 py-1 font-normal"
            >
              {competency}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
