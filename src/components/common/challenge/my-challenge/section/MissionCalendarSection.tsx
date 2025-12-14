import { twMerge } from '@/lib/twMerge';
import { Schedule } from '@/schema';
import { TALENT_POOL_MISSION_TH } from '@/utils/constants';
import React from 'react';
import MissionCalendar from '../mission-calendar/MissionCalendar';

const MissionTitleContent = ({
  todayTh,
  isBonusMission,
  isBonusMissionSubmitted,
}: {
  todayTh: number;
  isBonusMission: boolean;
  isBonusMissionSubmitted: boolean;
}) => {
  if (todayTh === TALENT_POOL_MISSION_TH)
    return '인재풀 미션 완료하고 채용 제안을 받아보세요!';

  if (isBonusMission && !isBonusMissionSubmitted)
    return '보너스 미션 완료하고 리워드 챙겨가세요!';

  return (
    <>
      <span className="text-neutral-0">오늘은</span>
      &nbsp;
      {todayTh}회차 <span className="text-neutral-0">미션날입니다!</span>
    </>
  );
};

const MissionTitleContainer = ({
  isFixed = false,
  className,
  children,
}: {
  isFixed?: boolean;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={twMerge(
        'flex items-center gap-2 rounded-xxs bg-primary-5 px-3 py-3',
        className,
      )}
    >
      <img
        src="/icons/check-star-primary.svg"
        alt="status icon"
        className="h-6 w-6"
      />
      <span className="flex-1 text-xsmall16 font-semibold text-primary">
        {children}
      </span>
      {isFixed && (
        <span className="rounded-xs bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
          고정
        </span>
      )}
    </div>
  );
};

interface Props {
  schedules: Schedule[];
  todayTh: number;
  isDone: boolean;
}

const MissionCalendarSection = ({ schedules, todayTh, isDone }: Props) => {
  const maxTh = Math.max(...schedules.map((item) => item.missionInfo.th ?? 0));
  const isAllMissionFinished = maxTh < todayTh;
  const isBonusMission = todayTh === 100;
  const bonusMissionSchedule = schedules.find(
    (item) => item.missionInfo.th === 100,
  );
  const isBonusMissionSubmitted =
    isBonusMission &&
    (bonusMissionSchedule?.attendanceInfo.result === 'PASS' ||
      bonusMissionSchedule?.attendanceInfo.result === 'FINAL_WRONG');
  const isEndedStatus =
    isDone || isBonusMissionSubmitted || isAllMissionFinished;

  return (
    <section className="mt-6">
      {!isEndedStatus && (
        <MissionTitleContainer>
          <MissionTitleContent
            todayTh={todayTh}
            isBonusMission={isBonusMission}
            isBonusMissionSubmitted={isBonusMissionSubmitted}
          />
        </MissionTitleContainer>
      )}
      <MissionCalendar
        className="mt-4 gap-2"
        schedules={schedules}
        todayTh={todayTh}
        isDone={isDone}
      />
    </section>
  );
};

export default MissionCalendarSection;
