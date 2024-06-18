import clsx from 'clsx';
import { Schedule } from '../../../../../schema';
import MissionIcon from './MissionIcon';
import MissionNotStartedIcon from './MissionNotStartedIcon';
import MissionTodayIcon from './MissionTodayIcon';
import MissionTopStatusBar from './MissionTopStatusBar';

interface Props {
  schedule: Schedule;
  todayTh: number;
}

const MissionCalendarItem = ({ schedule, todayTh }: Props) => {
  const mission = schedule.missionInfo;

  return (
    <div>
      <MissionTopStatusBar mission={mission} todayTh={todayTh} />
      <div className="mt-2 px-1">
        <span
          className={clsx('block w-full text-center text-xs', {
            'font-semibold text-primary': mission.th === todayTh,
          })}
        >
          {mission.startDate?.format('MM/DD(ddd)') ?? ''}
          <br />~ {mission.endDate?.format('MM/DD(ddd)') ?? ''}
        </span>
        {mission.th === todayTh ? (
          <MissionTodayIcon className="mt-3" schedule={schedule} />
        ) : (mission.th ?? 0) > todayTh ? (
          <MissionNotStartedIcon className="mt-3" mission={mission} />
        ) : (
          (mission.th ?? 0) < todayTh && (
            <MissionIcon className="mt-3" schedule={schedule} />
          )
        )}
      </div>
    </div>
  );
};

export default MissionCalendarItem;
