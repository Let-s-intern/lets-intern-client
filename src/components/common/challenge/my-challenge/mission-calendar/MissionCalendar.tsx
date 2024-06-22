import { twMerge } from 'tailwind-merge';
import { Schedule } from '../../../../../schema';
import MissionCalendarItem from './MissionCalendarItem';

interface Props {
  className?: string;
  schedules: Schedule[];
  todayTh: number;
  isDone: boolean;
}

const MissionCalendar = ({ className, schedules, todayTh, isDone }: Props) => {
  return (
    // <div className={clsx('grid grid-cols-7 gap-y-6', className)}>
    <div className={twMerge('flex', className)}>
      {schedules.map((schedule, index) => (
        <MissionCalendarItem
          key={index}
          schedule={schedule}
          todayTh={todayTh}
          className="flex-1"
          isDone={isDone}
        />
      ))}
    </div>
  );
};

export default MissionCalendar;
