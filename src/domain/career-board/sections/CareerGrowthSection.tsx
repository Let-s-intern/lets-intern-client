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
import { toCareerGrowthItems } from '../utils/careerGrowth';
import { toCareerGrowthCardConfigs } from '../utils/careerGrowthCard';

const EMPTY_CONFIG_BY_CATEGORY: Record<
  ApplicationCategory,
  { description: string; href: string; buttonText: string }
> = {
  PROGRAM: {
    description: '참여 중인 프로그램이 없어요.',
    href: '/program',
    buttonText: '프로그램 둘러보기',
  },
  LIBRARY: {
    description: '보유 중인 무료 자료집이 없어요.',
    href: '/library/list',
    buttonText: '무료 자료집 둘러보기',
  },
  GUIDEBOOK: {
    description: '보유 중인 가이드북이 없어요.',
    href: '/program?type=GUIDEBOOK',
    buttonText: '가이드북 둘러보기',
  },
};

const CareerGrowthSection = () => {
  const router = useRouter();
  const {
    data: applications,
    isLoading,
    isError,
  } = useMypageApplicationsQuery();
  const { setHasCareerData } = useCareerDataStatus();
  const [category, setCategory] = useState<ApplicationCategory>('PROGRAM');

  const items = useMemo(
    () => toCareerGrowthItems(applications ?? []),
    [applications],
  );

  const visibleItems = useMemo(() => {
    if (category === 'GUIDEBOOK') {
      return items.filter(
        (program) => program.programTypeKey === 'GUIDEBOOK',
      );
    }
    // 무료자료집 탭
    if (category === 'LIBRARY') {
      return [];
    }
    return items.filter((program) => program.programTypeKey !== 'GUIDEBOOK');
  }, [category, items]);

  const cardConfigs = useMemo(
    () => toCareerGrowthCardConfigs(visibleItems, category),
    [visibleItems, category],
  );

  // 데이터 존재 여부 확인 (전체 프로그램 기준)
  const hasData = items.length > 0;
  const hasVisibleData = cardConfigs.length > 0;

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
        <div className="flex flex-col gap-6 pt-1">
          <CategoryChips
            options={APPLICATION_CATEGORY_OPTIONS}
            selected={category}
            onChange={setCategory}
          />
          {hasVisibleData ? (
            <CareerGrowthList items={cardConfigs} />
          ) : (
            <div className="pb-6">
              <CareerCard.Empty
                description={EMPTY_CONFIG_BY_CATEGORY[category].description}
                buttonText={EMPTY_CONFIG_BY_CATEGORY[category].buttonText}
                buttonHref={EMPTY_CONFIG_BY_CATEGORY[category].href}
                onClick={() =>
                  router.push(EMPTY_CONFIG_BY_CATEGORY[category].href)
                }
              />
            </div>
          )}
        </div>
      }
    />
  );
};

export default CareerGrowthSection;
