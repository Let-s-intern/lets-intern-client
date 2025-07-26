import clsx from 'clsx';
import { Schedule } from '../../../../../schema';
import MissionIcon from './ChallengeMissionIcon';
import MissionNotStartedIcon from './ChallengeMissionNotStartedIcon';
import MissionTodayIcon from './ChallengeMissionTodayIcon';
import MissionTopStatusBar from './ChallengeMissionTopStatusBar';

interface Props {
  schedule: Schedule;
  todayTh: number;
  className?: string;
  isDone: boolean;
  isLast: boolean;
}

// 새로운 버전
const MissionCalendarItem = ({
  schedule,
  todayTh,
  className,
  isDone,
  isLast,
}: Props) => {
  const mission = schedule.missionInfo;
  const attendance = schedule.attendanceInfo;

  return (
    <div className={className}>
      <MissionTopStatusBar mission={schedule.missionInfo} todayTh={todayTh} />
      <div
        className={clsx(
          'mt-2 rounded-xs border border-neutral-80 px-2 py-2.5',
          !isLast && 'mr-2',
        )}
      >
        {mission.th === todayTh ? (
          // 오늘 미션 아이콘
          <MissionTodayIcon
            mission={mission}
            attendance={attendance}
            isDone={isDone}
          />
        ) : (mission.th ?? 0) > todayTh ? (
          // 시작 안한 미션 아이콘
          <MissionNotStartedIcon className="mt-3" schedule={schedule} />
        ) : (
          (mission.th ?? 0) < todayTh && (
            // 지난 아이콘
            <MissionIcon className="mt-3" schedule={schedule} isDone={isDone} />
          )
        )}
        {/* 일정 */}
        <span
          className={clsx('mt-1.5 block w-full text-left text-[10px]', {
            'text-primary': mission.th === todayTh,
          })}
        >
          {mission.startDate?.format('MM/DD(ddd)')}
          <br />~{mission.endDate?.format('MM/DD(ddd)')}
        </span>
      </div>
    </div>
  );
};

export default MissionCalendarItem;
