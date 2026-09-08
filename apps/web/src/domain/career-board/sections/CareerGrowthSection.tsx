'use client';

import dynamic from 'next/dynamic';

/*
  Jitsi SDK 는 ESM 전용이라 정적으로 끌어오면 마이페이지 초기 번들에 들어가고
  jest 가 변환하지 못해 이 파일을 쓰는 스위트가 통째로 죽는다. 실제로 회의실을 열 때만
  받아온다.
*/
const JitsiEmbedModal = dynamic(
  () => import('@/common/modal/JitsiEmbedModal'),
  { ssr: false },
);

import { mypageApplicationsQueryOptions } from '@/api/application';
import { useMyLiveMentoringApplicationsQuery } from '@/api/live-mentoring/liveMentoring';
import type { MyLiveMentoringApplication } from '@/api/live-mentoring/liveMentoringSchema';
import { questionButtonLabel } from '@/domain/live-mentoring/mypage/MentoringApplicationCard';

import QuestionModal from '@/domain/live-mentoring/question/QuestionModal';
import { mypageMagnetListQueryOptions } from '@/api/magnet/magnet';
import { LIBRARY_VISIBLE_MAGNET_TYPES } from '@/api/magnet/magnetSchema';
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
import CareerCard from '../../mypage/career/CareerCard';
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

/*
  커리어 성장 위젯은 출시알림·멘토링 탭을 지원하지 않는다(신청현황 전용 탭).
  멘토링은 `mypageApplicationsQueryOptions` 가 아니라 라이브 멘토링 전용 API 에서
  오므로, 여기에 탭만 생기면 언제나 비어 있는 탭이 된다.
*/
type CareerGrowthCategory = Exclude<ApplicationCategory, 'LAUNCH_ALERT'>;

const EXCLUDED_FROM_CAREER_GROWTH: ApplicationCategory[] = ['LAUNCH_ALERT'];

const CAREER_GROWTH_CATEGORY_OPTIONS = APPLICATION_CATEGORY_OPTIONS.filter(
  (option): option is { value: CareerGrowthCategory; label: string } =>
    !EXCLUDED_FROM_CAREER_GROWTH.includes(option.value),
);

const EMPTY_CONFIG_BY_CATEGORY: Record<
  CareerGrowthCategory,
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
  const [category, setCategory] = useState<CareerGrowthCategory>('PROGRAM');
  /*
    1대1 라이브 멘토링은 공통 목록에도 오지만 질문 작성 여부와 입장 링크가 없다.
    전용 API 를 함께 조회해 카드에 `멘토링 질문` 과 `멘토링 입장` 버튼을 붙인다.
    React Query 가 같은 키를 합치므로 마이페이지와 요청이 겹치지 않는다.
  */
  const { data: mentoringData } = useMyLiveMentoringApplicationsQuery();
  const [openApplicationId, setOpenApplicationId] = useState<number | null>(
    null,
  );
  const [entryApplicationId, setEntryApplicationId] = useState<number | null>(
    null,
  );

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

  const mentoringById = useMemo(() => {
    const map = new Map<number, MyLiveMentoringApplication>();
    for (const application of mentoringData?.applicationList ?? []) {
      map.set(application.applicationId, application);
    }
    return map;
  }, [mentoringData]);

  const programCardConfigs = useMemo(() => {
    const configs = toCareerGrowthCardConfigs(visibleItems, category);

    return configs.map((config) => {
      const mentoring = mentoringById.get(config.id);
      if (!mentoring) return config;

      // 마이페이지와 같은 값을 쓴다 — 서버가 판단한 결과다.
      const questionVisible = mentoring.questionEditable;

      return {
        ...config,
        // 마감(예약 24시간 전) 뒤에는 질문 버튼을 감춘다. 마이페이지와 같은 규칙이다.
        secondaryButton: questionVisible
          ? {
              label: questionButtonLabel(mentoring.questionWritten),
              onClick: () => setOpenApplicationId(mentoring.applicationId),
            }
          : undefined,
        /*
          새 탭이 아니라 Jitsi 모달로 들어간다. 마이페이지 카드와 같은 동선이다.
        */
        actionButton: {
          label: '멘토링 입장',
          disabled: mentoring.entryLink === null,
          onClick: () => setEntryApplicationId(mentoring.applicationId),
        },
      };
    });
  }, [visibleItems, category, mentoringById]);

  const openMentoring =
    openApplicationId === null ? null : mentoringById.get(openApplicationId);
  const entryMentoring =
    entryApplicationId === null ? null : mentoringById.get(entryApplicationId);

  const hasData = items.length > 0;

  useEffect(() => {
    if (hasData) {
      setHasCareerData(true);
    }
  }, [hasData, setHasCareerData]);

  return (
    <>
      <CareerCard
        title={TITLE}
        labelOnClick={() => router.push(HREF)}
        body={
          <div className="flex flex-col gap-6 pt-1">
            <CategoryChips
              options={CAREER_GROWTH_CATEGORY_OPTIONS}
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
      {entryMentoring && (
        <JitsiEmbedModal
          isOpen
          onClose={() => setEntryApplicationId(null)}
          meetingUrl={entryMentoring.entryLink}
          spaceName={entryMentoring.productName ?? '1:1 LIVE 멘토링'}
          startDate={entryMentoring.reservationStartAt}
          endDate={entryMentoring.reservationEndAt}
        />
      )}
      {openMentoring && (
        <QuestionModal
          applicationId={openMentoring.applicationId}
          readOnly={false}
          onClose={() => setOpenApplicationId(null)}
        />
      )}
    </>
  );
};

const LibraryGrowthList = () => {
  const router = useRouter();
  const { data: magnetData } = useSuspenseQuery(
    mypageMagnetListQueryOptions([...LIBRARY_VISIBLE_MAGNET_TYPES]),
  );

  // BE typeList 미적용/직렬화 호환 이슈에 대비한 클라이언트 측 방어 필터.
  // EVENT/LAUNCH_ALERT 는 캐리어보드 자료집 위젯에 절대 노출되지 않아야 한다.
  const visibleMagnetList = useMemo(() => {
    const visibleTypes = LIBRARY_VISIBLE_MAGNET_TYPES as readonly string[];
    return (magnetData?.magnetList ?? []).filter((m) =>
      visibleTypes.includes(m.type),
    );
  }, [magnetData]);

  const cardConfigs = useMemo(
    () => toLibraryCardConfigs(visibleMagnetList),
    [visibleMagnetList],
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
