import Announcement from '@/assets/icons/announcement.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import Pin from '@/assets/icons/pin.svg?react';
import useChallengeSchedule from '@/hooks/useChallengeSchedule';
import { twMerge } from '@/lib/twMerge';
import { ChallengeIdPrimitive } from '@/schema';
import { ReactNode } from 'react';
import { LuCalendarDays } from 'react-icons/lu';

const IconTitle = ({
  icon,
  children,
}: {
  icon: ReactNode;
  children?: ReactNode;
}) => {
  return (
    <div className="flex items-center gap-2 font-semibold text-neutral-0">
      {icon}
      {children}
    </div>
  );
};

const ScheduleBox = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        'flex flex-1 flex-col gap-3 rounded-xs bg-neutral-95 p-4 pb-5',
        className,
      )}
    >
      {children}
    </div>
  );
};

const ScheduleWrapper = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div className={twMerge('flex flex-col gap-1', className)}>{children}</div>
  );
};

const ScheduleDescription = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <p className={twMerge('text-xsmall14 md:text-xsmall16', className)}>
      {children}
    </p>
  );
};

interface Props {
  challenge: ChallengeIdPrimitive;
}

function ChallengeSchedule({ challenge }: Props) {
  const { startDate, deadline, duration, orientationDate } =
    useChallengeSchedule(challenge);

  return (
    <>
      <ScheduleBox className="rounded-b-none pb-0 md:rounded-xs md:pb-5">
        <ScheduleWrapper className="hidden md:block">
          <IconTitle icon={<Pin color="#4A76FF" width={20} height={20} />}>
            시작 일자
          </IconTitle>
          <ScheduleDescription>{startDate}</ScheduleDescription>
        </ScheduleWrapper>
        <ScheduleWrapper>
          <IconTitle
            icon={<Announcement color="#4A76FF" width={20} height={20} />}
          >
            진행 기간
          </IconTitle>
          <ScheduleDescription>{duration}</ScheduleDescription>
        </ScheduleWrapper>
      </ScheduleBox>
      <ScheduleBox className="rounded-t-none md:rounded-xs">
        <ScheduleWrapper>
          <IconTitle
            icon={<ClockIcon color="#4A76FF" width={20} height={20} />}
          >
            모집 마감
          </IconTitle>
          <ScheduleDescription>{deadline}</ScheduleDescription>
        </ScheduleWrapper>
        <ScheduleWrapper>
          <IconTitle
            icon={<LuCalendarDays color="#4A76FF" className="h-5 w-5" />}
          >
            <span className='inline-block after:ml-2 after:w-16 after:text-xsmall14 after:font-normal after:text-neutral-30 after:content-["온라인_진행"]'>
              OT 일자
            </span>
          </IconTitle>
          <ScheduleDescription>{orientationDate}</ScheduleDescription>
        </ScheduleWrapper>
      </ScheduleBox>
    </>
  );
}

export default ChallengeSchedule;
