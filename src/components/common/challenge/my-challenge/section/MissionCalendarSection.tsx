import { twMerge } from '@/lib/twMerge';
import { Schedule } from '@/schema';
import React from 'react';
import MissionCalendar from '../mission-calendar/MissionCalendar';

const MissionTitleContent = ({
  isDone,
  todayTh,
  schedules,
}: {
  isDone: boolean;
  todayTh: number;
  schedules: Schedule[];
}) => {
  const maxTh = Math.max(...schedules.map((item) => item.missionInfo.th ?? 0));
  const isAllMissionFinished = maxTh < todayTh;
  const isOtMission = todayTh === 0;
  const isBonusMission = todayTh === 100;

  if (isDone) return '챌린지가 종료되었습니다.';
  if (isAllMissionFinished) return '🎉 모든 미션이 완료되었습니다 🎉';
  if (isOtMission) return '챌린지가 시작됐어요! 함께 끝까지 완주해봐요!';
  if (isBonusMission) return <>보너스 미션 완료하고 리워드 챙겨가세요!</>;

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
  return (
    <section className="mt-6">
      <MissionTitleContainer>
        <MissionTitleContent
          isDone={isDone}
          todayTh={todayTh}
          schedules={schedules}
        />
      </MissionTitleContainer>
      {/* <MissionTooltipQuestion /> */}
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
