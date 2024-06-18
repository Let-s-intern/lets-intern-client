import clsx from 'clsx';
import { Schedule } from '../../../../../schema';
import MissionCalendarItem from './MissionCalendarItem';

interface Props {
  className?: string;
  schedules: Schedule[];
  todayTh: number;
}

const MissionCalendar = ({ className, schedules, todayTh }: Props) => {
  return (
    <div className={clsx('grid grid-cols-7 gap-y-6', className)}>
      {schedules.map((schedule, index) => (
        <MissionCalendarItem
          key={index}
          schedule={schedule}
          todayTh={todayTh}
        />
      ))}
    </div>
  );
};

export default MissionCalendar;
