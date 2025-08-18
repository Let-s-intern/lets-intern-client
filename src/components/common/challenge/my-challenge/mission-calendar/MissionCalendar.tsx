import { twMerge } from '@/lib/twMerge';
import { Schedule } from '@/schema';
import MissionCalendarItem from './MissionCalendarItem';

interface Props {
  className?: string;
  schedules: Schedule[];
  todayTh: number;
  isDone: boolean;
}

const MissionCalendar = ({ className, schedules, todayTh, isDone }: Props) => {
  return (
    <div className={twMerge('flex', className)}>
      {schedules.map((schedule, index) => (
        <MissionCalendarItem
          key={index}
          schedule={schedule}
          todayTh={todayTh}
          isDone={isDone}
          className="hover:bg-primary-5"
        />
      ))}
    </div>
  );
};

export default MissionCalendar;
