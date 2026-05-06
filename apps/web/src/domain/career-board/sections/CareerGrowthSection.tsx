'use client';

import { mypageApplicationsQueryOptions } from '@/api/application';
import { mypageMagnetListQueryOptions } from '@/api/magnet/magnet';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import {
  APPLICATION_CATEGORY_OPTIONS,
  ApplicationCategory,
} from '@/domain/mypage/application/constants';
import CategoryChips from '@/domain/mypage/ui/button/CategoryChips';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import CareerCard from '../../mypage/career/card/CareerCard';
import { useCareerDataStatus } from '../contexts/CareerDataStatusContext';
import CareerGrowthList from '../ui/CareerGrowthList';
import { SectionErrorFallback } from '../ui/SectionErrorFallback';
import { toCareerGrowthItems } from '../utils/careerGrowth';
import {
  toCareerGrowthCardConfigs,
  toLibraryCardConfigs,
} from '../utils/careerGrowthCard';

const TITLE = '커리어 성장';
const HREF = '/mypage/application';

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
  VOD: {
    description: '보유 중인 VOD 클래스가 없어요.',
    href: '/program?type=VOD',
    buttonText: 'VOD 클래스 둘러보기',
  },
};

const CareerGrowthSection = () => {
  const router = useRouter();

  return (
    <AsyncBoundary
      pendingFallback={
        <CareerCard
          title={TITLE}
          labelOnClick={() => router.push(HREF)}
          body={
            <LoadingContainer text="진행중인 프로그램을 불러오는 중입니다." />
          }
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
      <CareerGrowthContent />
    </AsyncBoundary>
  );
};

export default CareerGrowthSection;

const CareerGrowthContent = () => {
  const router = useRouter();
  const { data: applications } = useSuspenseQuery(
    mypageApplicationsQueryOptions,
  );
  const { setHasCareerData } = useCareerDataStatus();
  const [category, setCategory] = useState<ApplicationCategory>('PROGRAM');

  const isLibraryTab = category === 'LIBRARY';

  const items = useMemo(
    () => toCareerGrowthItems(applications ?? []),
    [applications],
  );

  const visibleItems = useMemo(() => {
    if (category === 'GUIDEBOOK') {
      return items.filter((program) => program.programTypeKey === 'GUIDEBOOK');
    }
    if (category === 'VOD') {
      return items.filter((program) => program.programTypeKey === 'VOD');
    }
    if (category === 'LIBRARY') {
      return [];
    }
    return items.filter(
      (program) =>
        program.programTypeKey !== 'GUIDEBOOK' &&
        program.programTypeKey !== 'VOD',
    );
  }, [category, items]);

  const programCardConfigs = useMemo(
    () => toCareerGrowthCardConfigs(visibleItems, category),
    [visibleItems, category],
  );

  const hasData = items.length > 0;

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
        <div className="flex flex-col gap-6 pt-1">
          <CategoryChips
            options={APPLICATION_CATEGORY_OPTIONS}
            selected={category}
            onChange={setCategory}
          />
          {isLibraryTab ? (
            <AsyncBoundary
              pendingFallback={
                <LoadingContainer text="자료집을 불러오는 중입니다." />
              }
              rejectedFallback={({ resetErrorBoundary }) => (
                <SectionErrorFallback onRetry={resetErrorBoundary} />
              )}
            >
              <LibraryGrowthList />
            </AsyncBoundary>
          ) : programCardConfigs.length > 0 ? (
            <CareerGrowthList items={programCardConfigs} />
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

const LibraryGrowthList = () => {
  const router = useRouter();
  const { data: magnetData } = useSuspenseQuery(mypageMagnetListQueryOptions());

  const cardConfigs = useMemo(
    () => toLibraryCardConfigs(magnetData?.magnetList ?? []),
    [magnetData],
  );

  if (cardConfigs.length === 0) {
    return (
      <div className="pb-6">
        <CareerCard.Empty
          description={EMPTY_CONFIG_BY_CATEGORY.LIBRARY.description}
          buttonText={EMPTY_CONFIG_BY_CATEGORY.LIBRARY.buttonText}
          buttonHref={EMPTY_CONFIG_BY_CATEGORY.LIBRARY.href}
          onClick={() => router.push(EMPTY_CONFIG_BY_CATEGORY.LIBRARY.href)}
        />
      </div>
    );
  }

  return <CareerGrowthList items={cardConfigs} />;
};
