import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { Schedule } from '@/schema';
import { TALENT_POOL_MISSION_TH } from '@/utils/constants';
import { Dayjs } from 'dayjs';
import React from 'react';
import MissionCalendar from './MissionCalendar';

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
        'rounded-xxs bg-primary-5 flex items-center gap-2 px-3 py-3',
        className,
      )}
    >
      <img
        src="/icons/check-star-primary.svg"
        alt="status icon"
        className="h-6 w-6"
      />
      <span className="text-xsmall16 text-primary flex-1 font-semibold">
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

/** 편성에서 가장 늦게 닫히는 미션의 마감 시각 */
const getLastEndDate = (schedules: Schedule[]) =>
  schedules.reduce<Dayjs | null>((latest, item) => {
    const endDate = item.missionInfo.endDate;
    if (!endDate) return latest;
    return !latest || endDate.isAfter(latest) ? endDate : latest;
  }, null);

interface Props {
  schedules: Schedule[];
  /** 오늘 진행 중인 회차. 진행 중인 미션이 없는 시간대에는 null 이다. */
  todayTh: number | null;
  isDone: boolean;
}

const MissionCalendarSection = ({ schedules, todayTh, isDone }: Props) => {
  // 모든 미션이 끝났는지는 마지막 미션의 마감 시각으로 본다.
  // 예전에는 maxTh < todayTh 로 봤는데, todayTh 폴백이 늘 maxTh + 1 이라 항상 참이었다.
  const lastEndDate = getLastEndDate(schedules);
  const isAllMissionFinished =
    lastEndDate !== null && dayjs().isAfter(lastEndDate);
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
      {/* "오늘은 N회차 미션날입니다" 는 오늘 회차가 있을 때만 성립한다. */}
      {!isEndedStatus && todayTh !== null && (
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
