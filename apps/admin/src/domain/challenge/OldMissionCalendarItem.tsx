import { Schedule } from '@/schema';
import clsx from 'clsx';
import MissionTopStatusBar from './my-challenge/mission-calendar/MissionTopStatusBar';
import OldMissionIcon from './OldMissionIcon';
import OldMissionNotStartedIcon from './OldMissionNotStartedIcon';
import OldMissionTodayIcon from './OldMissionTodayIcon';

interface Props {
  schedule: Schedule;
  todayTh: number;
  className?: string;
  isDone: boolean;
}

const OldMissionCalendarItem = ({
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
          <OldMissionTodayIcon
            className="mt-3"
            mission={mission}
            attendance={attendance}
            isDone={isDone}
          />
        ) : (mission.th ?? 0) > todayTh ? (
          <OldMissionNotStartedIcon className="mt-3" schedule={schedule} />
        ) : (
          (mission.th ?? 0) < todayTh && (
            <OldMissionIcon
              className="mt-3"
              schedule={schedule}
              isDone={isDone}
            />
          )
        )}
      </div>
    </div>
  );
};

export default OldMissionCalendarItem;
