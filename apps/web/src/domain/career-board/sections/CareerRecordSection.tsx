'use client';

import { userCareerQueryOptions } from '@/api/career/career';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { toCareerDateDot } from '@/utils/career';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CareerCard from '../../mypage/career/card/CareerCard';
import { useCareerDataStatus } from '../contexts/CareerDataStatusContext';

const TITLE = '커리어 기록';
const HREF = '/mypage/career/record';

const CareerRecordSection = () => {
  const router = useRouter();

  return (
    <AsyncBoundary
      pendingFallback={
        <CareerCard
          title={TITLE}
          labelOnClick={() => router.push(HREF)}
          body={<LoadingContainer text="커리어 기록 조회 중" />}
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
      <CareerRecordContent />
    </AsyncBoundary>
  );
};

export default CareerRecordSection;

const CareerRecordContent = () => {
  const router = useRouter();
  const { data } = useSuspenseQuery(
    userCareerQueryOptions(
      { page: 0, size: 1 },
      { sort: 'desc', sortType: 'START_DATE' },
    ),
  );
  const { setHasCareerData } = useCareerDataStatus();

  const latestCareer = data?.userCareers[0];
  const hasData = !!latestCareer;

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
        hasData && latestCareer ? (
          <CareerRecordBody
            category="경력"
            jobTitle={latestCareer.job || ''}
            companyName={latestCareer.company || ''}
            employmentType={latestCareer.employmentType || ''}
            startDate={
              latestCareer.startDate
                ? toCareerDateDot(latestCareer.startDate)
                : ''
            }
            endDate={
              latestCareer.endDate ? toCareerDateDot(latestCareer.endDate) : ''
            }
          />
        ) : (
          <CareerCard.Empty
            height={109}
            description="아직 등록된 커리어가 없어요"
            buttonText="커리어 기록하기"
            buttonHref={HREF}
            onClick={() => router.push(HREF)}
          />
        )
      }
    />
  );
};

const SectionErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-8">
    <p className="text-xsmall14 text-neutral-40">불러오지 못했어요.</p>
    <button
      type="button"
      onClick={onRetry}
      className="rounded-xs border-neutral-80 text-xsmall14 text-neutral-20 border px-4 py-2 font-medium"
    >
      다시 시도
    </button>
  </div>
);

interface CareerRecordBodyProps {
  category: string;
  jobTitle: string;
  companyName: string;
  employmentType: string;
  startDate: string;
  endDate: string;
}

const CareerRecordBody = ({
  category,
  jobTitle,
  companyName,
  employmentType,
  startDate,
  endDate,
}: CareerRecordBodyProps) => {
  const workPeriod = endDate ? `${startDate} - ${endDate}` : startDate;

  return (
    <div className="flex h-[109px] flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        <span className="text-xxsmall12 font-normal text-[#4138A3]">
          {category}
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-xsmall14 text-neutral-0 font-normal">
            {jobTitle}
          </span>
          <span className="text-xsmall16 text-neutral-0 truncate font-medium">
            {companyName}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xsmall14 text-neutral-0 font-normal">
              {employmentType}
            </span>
            <span className="text-xsmall14 text-neutral-40 font-normal">
              {workPeriod}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
