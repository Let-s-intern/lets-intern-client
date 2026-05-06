import { Schedule } from '@/schema';
import clsx from 'clsx';

interface Props {
  className?: string;
  schedule: Schedule;
}

const OldMissionNotStartedIcon = ({ className, schedule }: Props) => {
  return (
    <div
      className={clsx(
        'flex aspect-square flex-col items-center justify-center rounded-md',
        className,
      )}
    >
      <div className="mb-[10%] flex h-[30%] min-h-[2.5rem] w-[30%] min-w-[2.5rem] rounded-full bg-[#D0CFCF]" />
      <span className="block text-sm font-semibold text-[#D0CFCF]">
        {schedule.missionInfo.th}회차
      </span>
    </div>
  );
};

export default OldMissionNotStartedIcon;
