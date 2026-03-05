import { useMypageApplicationsQuery } from '@/api/application';
import LoadingContainer from '@/common/loading/LoadingContainer';
import {
  APPLICATION_CATEGORY_OPTIONS,
  ApplicationCategory,
} from '@/domain/mypage/application/constants';
import CategoryChips from '@/domain/mypage/ui/button/CategoryChips';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import CareerCard from '../../mypage/career/card/CareerCard';
import { useCareerDataStatus } from '../contexts/CareerDataStatusContext';
import CareerGrowthList from '../ui/CareerGrowthList';
import {
  CareerGrowthProgram,
  toCareerGrowthPrograms,
} from '../utils/careerGrowth';

const CareerGrowthSection = () => {
  const router = useRouter();
  const {
    data: applications,
    isLoading,
    isError,
  } = useMypageApplicationsQuery();
  const { setHasCareerData } = useCareerDataStatus();
  const [category, setCategory] = useState<ApplicationCategory>('PROGRAM');

  const programs: CareerGrowthProgram[] = useMemo(
    () => toCareerGrowthPrograms(applications ?? []),
    [applications],
  );

  // 데이터 존재 여부 확인
  const hasData = programs.length > 0;

  useEffect(() => {
    if (hasData) {
      setHasCareerData(true);
    }
  }, [hasData, setHasCareerData]);

  if (isLoading) {
    return (
      <CareerCard
        title="커리어 성장"
        labelOnClick={() => router.push('/mypage/application')}
        body={
          <LoadingContainer text="진행중인 프로그램을 불러오는 중입니다." />
        }
      />
    );
  }

  if (isError) {
    return (
      <CareerCard
        title="커리어 성장"
        labelOnClick={() => router.push('/mypage/application')}
        body={
          <div className="py-8 text-center text-neutral-40">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        }
      />
    );
  }
  return (
    <CareerCard
      title="커리어 성장"
      labelOnClick={() => router.push('/mypage/application')}
      body={
        hasData ? (
          <div className="flex flex-col gap-6 pt-1">
            <CategoryChips
              options={APPLICATION_CATEGORY_OPTIONS}
              selected={category}
              onChange={setCategory}
            />
            <CareerGrowthList
              programs={programs}
              applications={applications ?? []}
            />
          </div>
        ) : (
          <CareerCard.Empty
            description="참여 중인 프로그램이 없어요."
            buttonText="프로그램 둘러보기"
            buttonHref="/program"
            onClick={() => router.push('/program')}
          />
        )
      }
    />
  );
};

export default CareerGrowthSection;
