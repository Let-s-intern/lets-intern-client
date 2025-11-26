import { useGetUserCareerQuery } from '@/api/career';
import LoadingContainer from '@/components/common/ui/loading/LoadingContainer';
import { toCareerDateDot } from '@/utils/career';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CareerCard from '../../common/mypage/career/card/CareerCard';
import { useCareerDataStatus } from '../contexts/CareerDataStatusContext';

const CareerRecordSection = () => {
  const router = useRouter();

  const { data, isLoading } = useGetUserCareerQuery(
    { page: 0, size: 1 },
    { sort: 'desc', sortType: 'START_DATE' },
  );
  const { setHasCareerData } = useCareerDataStatus();

  const latestCareer = data?.userCareers[0];
  const hasData = !!latestCareer;

  useEffect(() => {
    if (hasData) {
      setHasCareerData(true);
    }
  }, [hasData, setHasCareerData]);

  if (isLoading) {
    return (
      <CareerCard
        title="커리어 기록"
        labelOnClick={() => router.push('/mypage/career/record')}
        body={<LoadingContainer text="커리어 기록 조회 중" />}
      />
    );
  }

  return (
    <CareerCard
      title="커리어 기록"
      labelOnClick={() => router.push('/mypage/career/record')}
      body={
        hasData && latestCareer ? (
          <CareerRecordBody
            category="경력"
            jobTitle={latestCareer.job || ''}
            companyName={latestCareer.company || ''}
            employmentType={latestCareer.employmentType || ''}
            startDate={toCareerDateDot(latestCareer.startDate)}
            endDate={
              latestCareer.endDate ? toCareerDateDot(latestCareer.endDate) : ''
            }
          />
        ) : (
          <CareerCard.Empty
            description="아직 등록된 커리어가 없어요"
            buttonText="커리어 기록하기"
            buttonHref="/mypage/career/record"
            onClick={() => router.push('/mypage/career/record')}
          />
        )
      }
    />
  );
};

export default CareerRecordSection;

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
    <div className="flex flex-col gap-4">
      {/* 경력 카테고리 */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xxsmall12 font-normal text-[#4138A3]">
          {category}
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-xsmall14 font-normal text-neutral-0">
            {jobTitle}
          </span>
          <span className="truncate text-xsmall16 font-medium text-neutral-0">
            {companyName}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xsmall14 font-normal text-neutral-0">
              {employmentType}
            </span>
            <span className="text-xsmall14 font-normal text-neutral-40">
              {workPeriod}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
