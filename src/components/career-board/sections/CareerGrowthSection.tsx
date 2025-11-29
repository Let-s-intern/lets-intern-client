import {
  MypageApplication,
  useMypageApplicationsQuery,
} from '@/api/application';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import {
  challengePricePlanToText,
  newProgramTypeToText,
} from '@/utils/convert';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import CareerCard from '../../common/mypage/career/card/CareerCard';
import { useCareerDataStatus } from '../contexts/CareerDataStatusContext';

const CareerGrowthSection = () => {
  const router = useRouter();
  const {
    data: applications,
    isLoading,
    isError,
  } = useMypageApplicationsQuery();
  const { setHasCareerData } = useCareerDataStatus();

  // API 데이터를 Program 인터페이스로 변환
  const programs = useMemo(() => {
    if (!applications || applications.length === 0) return [];

    // 진행중과 진행예정 프로그램 분리
    const proceedingPrograms: MypageApplication[] = [];
    const upcomingPrograms: MypageApplication[] = [];

    applications.forEach((app) => {
      // programId가 유효한 경우만 포함
      if (!app.programId) return;

      if (app.programStatusType === 'PROCEEDING') {
        proceedingPrograms.push(app);
      } else if (app.programStatusType === 'PREV') {
        upcomingPrograms.push(app);
      }
    });

    // 진행중과 진행예정 프로그램을 모두 표시 (진행중 우선)
    // 각 그룹 내에서는 시작일 기준 오름차순 정렬
    const sortByStartDate = (a: MypageApplication, b: MypageApplication) => {
      const dateA = a.programStartDate;
      const dateB = b.programStartDate;
      if (!dateA || !dateB) return 0;
      return dateA.isBefore(dateB) ? -1 : 1;
    };

    if (proceedingPrograms.length > 1) {
      proceedingPrograms.sort(sortByStartDate);
    }
    if (upcomingPrograms.length > 1) {
      upcomingPrograms.sort(sortByStartDate);
    }

    const targetPrograms = [...proceedingPrograms, ...upcomingPrograms];

    return targetPrograms.map((app) => convertApplicationToProgram(app));
  }, [applications]);

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
          <CareerGrowthBody
            programs={programs}
            applications={applications ?? []}
          />
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

interface Program {
  id: number;
  programId: number;
  thumbnail: string;
  status: string;
  programType: string;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  purchasePlan: string;
}

interface CareerGrowthBodyProps {
  programs: Program[];
  applications: MypageApplication[];
}

const CareerGrowthBody = ({
  programs,
  applications,
}: CareerGrowthBodyProps) => {
  // programId로 application 찾기
  const getApplication = (programId: number) => {
    return applications.find((app) => app.programId === programId);
  };

  return (
    <div className="flex flex-col gap-4">
      {programs.map((program) => {
        const application = getApplication(program.id);
        return (
          <ProgramCard
            key={program.id}
            program={program}
            programStartDate={application?.programStartDate ?? null}
            programStatusType={application?.programStatusType ?? null}
          />
        );
      })}
    </div>
  );
};

interface ProgramCardProps {
  program: Program;
  programStartDate: Dayjs | null;
  programStatusType: 'PROCEEDING' | 'PREV' | 'POST' | null;
}

const ProgramCard = ({
  program,
  programStartDate,
  programStatusType,
}: ProgramCardProps) => {
  const period = `${program.startDate} ~ ${program.endDate}`;

  // 진행 예정 프로그램의 경우, 시작일 이전이면 버튼 비활성화
  const isDashboardDisabled =
    programStatusType === 'PREV' &&
    programStartDate !== null &&
    dayjs().isBefore(programStartDate);

  return (
    <div className="flex flex-col gap-5 md:flex-row md:gap-4">
      <div className="flex w-full gap-3 md:flex-row md:gap-4">
        {/* 썸네일 */}
        {program.thumbnail ? (
          <img
            src={program.thumbnail}
            alt={program.title}
            className="h-[85px] w-[113px] shrink-0 rounded-xs object-cover md:h-[119px] md:w-[158px]"
          />
        ) : (
          <div className="h-[85px] w-[113px] shrink-0 rounded-xs bg-neutral-80 md:h-[119px] md:w-[158px]" />
        )}

        {/* 내용 */}
        <div className="flex flex-1 flex-col gap-2">
          {/* 상단: 태그, 프로그램 종류, 진행기간, 버튼 */}
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={twMerge(
                  'rounded-xxs px-2 py-0.5 text-xxsmall12 font-normal',
                  program.status === '진행예정'
                    ? 'border border-neutral-80 text-primary'
                    : 'bg-primary-10 text-primary',
                )}
              >
                {program.status}
              </span>
              <span className="text-xxsmall12 font-normal text-neutral-40">
                {program.programType}
              </span>
              <div className="hidden h-4 w-px bg-neutral-80 md:block" />
              <span className="text-xxsmall12 font-normal text-neutral-40">
                진행기간 {period}
              </span>
            </div>
            <DashboardButton
              programId={program.programId}
              applicationId={program.id}
              variant="desktop"
              disabled={isDashboardDisabled}
            />
          </div>

          {/* 중간: 제목, 설명 */}
          <div className="flex flex-col gap-1">
            <h3 className="text-xsmall16 font-semibold text-neutral-0">
              {program.title}
            </h3>
            <p className="text-xsmall14 text-neutral-20 md:line-clamp-2">
              {program.description}
            </p>
          </div>

          {/* 하단: 구매플랜 */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <span className="flex flex-row gap-1 text-xxsmall12 text-neutral-0">
              구매플랜
              <p className="text-xxsmall12 text-primary">
                {program.purchasePlan}
              </p>
            </span>
          </div>
        </div>
      </div>
      <DashboardButton
        programId={program.programId}
        variant="mobile"
        applicationId={program.id}
        disabled={isDashboardDisabled}
      />
    </div>
  );
};

interface DashboardButtonProps {
  programId: number;
  applicationId: number;
  variant: 'mobile' | 'desktop';
  disabled?: boolean;
}

const DashboardButton = ({
  programId,
  applicationId,
  variant,
  disabled = false,
}: DashboardButtonProps) => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() =>
        !disabled && router.push(`/challenge/${applicationId}/${programId}`)
      }
      disabled={disabled}
      className={twMerge(
        'rounded-xxs border px-3 py-1.5 text-xsmall14 font-normal transition-colors',
        disabled
          ? 'cursor-not-allowed border-neutral-60 bg-neutral-90 text-neutral-40'
          : 'border-primary text-primary hover:bg-primary/5',
        variant === 'mobile' ? 'w-full md:hidden' : 'hidden shrink-0 md:block',
      )}
    >
      대시보드 입장
    </button>
  );
};

// API 데이터를 Program 인터페이스로 변환하는 함수
const convertApplicationToProgram = (
  application: MypageApplication,
): Program => {
  const status =
    application.programStatusType === 'PROCEEDING'
      ? '참여중'
      : application.programStatusType === 'PREV'
        ? '진행예정'
        : '';

  const programType = application.programType
    ? newProgramTypeToText[application.programType] || application.programType
    : '';

  const formatDate = (date: Dayjs | null): string => {
    if (!date) return '';
    return date.format('YY.MM.DD');
  };

  const purchasePlan = application.pricePlanType
    ? challengePricePlanToText[application.pricePlanType] ||
      application.pricePlanType
    : '';

  return {
    id: application.id ?? 0,
    programId: application.programId ?? 0,
    thumbnail: application.programThumbnail ?? '',
    status,
    programType,
    startDate: formatDate(application.programStartDate),
    endDate: formatDate(application.programEndDate),
    title: application.programTitle ?? '',
    description: application.programShortDesc ?? '',
    purchasePlan,
  };
};
