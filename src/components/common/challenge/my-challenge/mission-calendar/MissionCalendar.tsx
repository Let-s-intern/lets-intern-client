import clsx from 'clsx';

import MissionCalendarItem from './MissionCalendarItem';

interface Props {
  className?: string;
  missionList: any;
  todayTh: number;
}

const MissionCalendar = ({ className, missionList, todayTh }: Props) => {
  return (
    <div className={clsx('grid grid-cols-7 gap-x-3 gap-y-4', className)}>
      {missionList.map((mission: any, index: number) => (
        <MissionCalendarItem key={index} mission={mission} todayTh={todayTh} />
      ))}
    </div>
  );
};

export default MissionCalendar;
