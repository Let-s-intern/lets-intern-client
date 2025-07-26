import clsx from 'clsx';
import { Schedule } from '../../../../../schema';

interface Props {
  className?: string;
  schedule: Schedule;
}
//새로운 버전 -안고침
const MissionNotStartedIcon = ({ className, schedule }: Props) => {
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
        <br />
        미션
      </span>
    </div>
  );
};

export default MissionNotStartedIcon;
