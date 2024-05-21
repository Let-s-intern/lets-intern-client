import clsx from 'clsx';

import { formatToMonthDate } from '../../../../../utils/formatDateString';
import MissionIcon from './MissionIcon';
import MissionNotStartedIcon from './MissionNotStartedIcon';
import MissionTodayIcon from './MissionTodayIcon';
import MissionTopStatusBar from './MissionTopStatusBar';

interface Props {
  mission: any;
  todayTh: number;
}

const MissionCalendarItem = ({ mission, todayTh }: Props) => {
  return (
    <div>
      <MissionTopStatusBar mission={mission} todayTh={todayTh} />
      <div className="mt-2 px-1.5">
        <span
          className={clsx('block w-full text-center text-xs', {
            'font-semibold text-primary': mission.missionTh === todayTh,
          })}
        >
          {formatToMonthDate(mission.missionStartDate)}
          <br />~ {formatToMonthDate(mission.missionEndDate)}
        </span>
        {mission.missionTh === todayTh ? (
          <MissionTodayIcon className="mt-3" mission={mission} />
        ) : mission.missionTh > todayTh ? (
          <MissionNotStartedIcon className="mt-3" mission={mission} />
        ) : (
          mission.missionTh < todayTh && (
            <MissionIcon className="mt-3" mission={mission} />
          )
        )}
      </div>
    </div>
  );
};

export default MissionCalendarItem;
