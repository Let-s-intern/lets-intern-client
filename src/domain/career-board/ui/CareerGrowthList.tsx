import { MypageApplication } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import type { CareerGrowthProgram } from '../utils/careerGrowth';

interface CareerGrowthListProps {
  programs: CareerGrowthProgram[];
  applications: MypageApplication[];
}

const CareerGrowthList = ({ programs, applications }: CareerGrowthListProps) => {
  const applicationMap = applications.reduce<
    Record<number, MypageApplication>
  >((acc, application) => {
    if (application.id == null) return acc;
    acc[application.id] = application;
    return acc;
  }, {});

  const getApplication = (programId: number) => {
    return applicationMap[programId];
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

export default CareerGrowthList;

interface ProgramCardProps {
  program: CareerGrowthProgram;
  programStartDate: Dayjs | null;
  programStatusType: 'PROCEEDING' | 'PREV' | 'POST' | null;
}

const ProgramCard = ({
  program,
  programStartDate,
  programStatusType,
}: ProgramCardProps) => {
  const period = `${program.startDate} ~ ${program.endDate}`;

  const isDashboardDisabled =
    programStatusType === 'PREV' &&
    programStartDate !== null &&
    dayjs().isBefore(programStartDate);

  return (
    <div className="flex flex-col gap-5 md:flex-row md:gap-4">
      <div className="flex w-full gap-3 md:flex-row md:gap-4">
        {program.thumbnail ? (
          <img
            src={program.thumbnail}
            alt={program.title}
            className="h-[85px] w-[113px] shrink-0 rounded-xs object-cover md:h-[119px] md:w-[158px]"
          />
        ) : (
          <div className="h-[85px] w-[113px] shrink-0 rounded-xs bg-neutral-80 md:h-[119px] md:w-[158px]" />
        )}

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex w-full flex-wrap items-center gap-2">
            <span
              className={twMerge(
                'rounded-xxs px-2 py-0.5 text-xxsmall12 font-normal',
                program.status === '참여예정'
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

          <div className="flex flex-col gap-1 md:flex-row md:items-start md:gap-12">
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="text-xsmall16 font-semibold text-neutral-0">
                {program.title}
              </h3>
              <p className="text-xsmall14 text-neutral-20 md:line-clamp-2">
                {program.description}
              </p>
            </div>
            <DashboardButton
              programId={program.programId}
              applicationId={program.id}
              variant="desktop"
              disabled={isDashboardDisabled}
            />
          </div>

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
