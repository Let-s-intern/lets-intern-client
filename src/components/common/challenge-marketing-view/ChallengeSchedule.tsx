import Announcement from '@/assets/icons/announcement.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import Pin from '@/assets/icons/pin.svg?react';
import {
  LOCALIZED_YYYY_MDdd_HH,
  LOCALIZED_YYYY_MDdd_HHmm,
  LOCALIZED_YYYY_MMDD,
} from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
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
  const startDate = dayjs(challenge.startDate);
  const endDate = dayjs(challenge.endDate);
  const deadline = dayjs(challenge.deadline);

  return (
    <>
      <ScheduleBox className="rounded-b-none pb-0 md:rounded-xs md:pb-5">
        <ScheduleWrapper className="hidden md:block">
          <IconTitle icon={<Pin color="#4A76FF" width={20} height={20} />}>
            시작 일자
          </IconTitle>
          <ScheduleDescription>
            {startDate.format(LOCALIZED_YYYY_MMDD)}
          </ScheduleDescription>
        </ScheduleWrapper>
        <ScheduleWrapper>
          <IconTitle
            icon={<Announcement color="#4A76FF" width={20} height={20} />}
          >
            진행 기간
          </IconTitle>
          <ScheduleDescription>
            {startDate.format(LOCALIZED_YYYY_MDdd_HHmm)} -
            <br className="md:hidden" />{' '}
            {endDate.format(LOCALIZED_YYYY_MDdd_HHmm)}
          </ScheduleDescription>
        </ScheduleWrapper>
      </ScheduleBox>
      <ScheduleBox className="rounded-t-none md:rounded-xs">
        <ScheduleWrapper>
          <IconTitle
            icon={<ClockIcon color="#4A76FF" width={20} height={20} />}
          >
            모집 마감
          </IconTitle>
          <ScheduleDescription>
            {deadline.format(LOCALIZED_YYYY_MDdd_HHmm)}
          </ScheduleDescription>
        </ScheduleWrapper>
        <ScheduleWrapper>
          <IconTitle
            icon={<LuCalendarDays color="#4A76FF" className="h-5 w-5" />}
          >
            <span className='inline-block after:ml-2 after:w-16 after:text-xsmall14 after:font-normal after:text-neutral-30 after:content-["온라인_진행"]'>
              OT 일자
            </span>
          </IconTitle>
          <ScheduleDescription>
            {startDate?.get('minute') === 0
              ? startDate?.format(LOCALIZED_YYYY_MDdd_HH)
              : startDate?.format(LOCALIZED_YYYY_MDdd_HHmm)}{' '}
            ~ {startDate?.add(40, 'minute').format('HH시 mm분')}
          </ScheduleDescription>
        </ScheduleWrapper>
      </ScheduleBox>
    </>
  );
}

export default ChallengeSchedule;
