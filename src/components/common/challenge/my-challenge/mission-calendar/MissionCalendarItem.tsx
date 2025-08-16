import { Schedule } from '@/schema';
import clsx from 'clsx';
import MissionIcon from './MissionIcon';
import MissionNotStartedIcon from './MissionNotStartedIcon';
import MissionTodayIcon from './MissionTodayIcon';

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
      <div className="px-1.5">
        {mission.th === todayTh ? (
          <MissionTodayIcon
            mission={mission}
            attendance={attendance}
            isDone={isDone}
          />
        ) : (mission.th ?? 0) > todayTh ? (
          <MissionNotStartedIcon schedule={schedule} />
        ) : (
          (mission.th ?? 0) < todayTh && (
            <MissionIcon schedule={schedule} isDone={isDone} />
          )
        )}
        <span
          className={clsx('block w-full text-center text-xs', {
            'font-semibold text-primary': mission.th === todayTh,
          })}
        >
          {mission.startDate?.format('MM/DD(ddd)')}
          <br />~ {mission.endDate?.format('MM/DD(ddd)')}
        </span>
      </div>
    </div>
  );
};

export default MissionCalendarItem;
