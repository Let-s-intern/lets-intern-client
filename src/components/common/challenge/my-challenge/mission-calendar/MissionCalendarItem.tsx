import { Schedule } from '@/schema';
import clsx from 'clsx';
import MissionIcon from './MissionIcon';
import MissionNotStartedIcon from './MissionNotStartedIcon';
import MissionTodayIcon from './MissionTodayIcon';
import MissionTopStatusBar from './MissionTopStatusBar';

interface Props {
  schedule: Schedule;
  todayTh: number;
  className?: string;
  isDone: boolean;
}

const MissionCalendarItem = ({
  schedule,
  todayTh,
  className,
  isDone,
}: Props) => {
  const mission = schedule.missionInfo;
  const attendance = schedule.attendanceInfo;

  return (
    <div className={className}>
      <MissionTopStatusBar mission={schedule.missionInfo} todayTh={todayTh} />
      <div className="mt-2 px-1.5">
        <span
          className={clsx('block w-full text-center text-xs', {
            'font-semibold text-primary': mission.th === todayTh,
          })}
        >
          {mission.startDate?.format('MM/DD(ddd)')}
          <br />~ {mission.endDate?.format('MM/DD(ddd)')}
        </span>
        {mission.th === todayTh ? (
          <MissionTodayIcon
            className="mt-3"
            mission={mission}
            attendance={attendance}
            isDone={isDone}
          />
        ) : (mission.th ?? 0) > todayTh ? (
          <MissionNotStartedIcon className="mt-3" schedule={schedule} />
        ) : (
          (mission.th ?? 0) < todayTh && (
            <MissionIcon className="mt-3" schedule={schedule} isDone={isDone} />
          )
        )}
      </div>
    </div>
  );
};

export default MissionCalendarItem;
