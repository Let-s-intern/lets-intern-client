import { twMerge } from '@/lib/twMerge';
import { Schedule } from '../../../../../schema';
import MissionCalendarItem from './ChallengeMissionCalendarItem';

interface Props {
  className?: string;
  schedules: Schedule[];
  todayTh: number;
  isDone: boolean;
}

// 새로운 버전
const MissionCalendar = ({ className, schedules, todayTh, isDone }: Props) => {
  return (
    <div className={twMerge('flex', className)}>
      {schedules.map((schedule, index) => (
        <MissionCalendarItem
          key={index}
          schedule={schedule}
          todayTh={todayTh}
          className="flex-1"
          isDone={isDone}
          isLast={index === schedules.length - 1}
        />
      ))}
    </div>
  );
};

export default MissionCalendar;
