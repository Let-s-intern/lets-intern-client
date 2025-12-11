import { twMerge } from '@/lib/twMerge';
import { Schedule } from '@/schema';
import OldMissionCalendarItem from './OldMissionCalendarItem';

interface Props {
  className?: string;
  schedules: Schedule[];
  todayTh: number;
  isDone: boolean;
}

const OldMissionCalendar = ({
  className,
  schedules,
  todayTh,
  isDone,
}: Props) => {
  return (
    <div className={twMerge('flex', className)}>
      {schedules.map((schedule, index) => (
        <OldMissionCalendarItem
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

export default OldMissionCalendar;
