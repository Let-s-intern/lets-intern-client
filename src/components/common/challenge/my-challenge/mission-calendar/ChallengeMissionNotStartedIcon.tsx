import { Schedule } from '@/schema';
import clsx from 'clsx';

interface Props {
  className?: string;
  schedule: Schedule;
}
//새로운 버전
const MissionNotStartedIcon = ({ className, schedule }: Props) => {
  const isBonus = schedule.missionInfo.th === 100;

  return (
    <div className={clsx('flex cursor-pointer flex-col', className)}>
      <i className="block h-3.5 w-3.5">
        <img
          src="/icons/check-gray-outline.svg"
          alt="not-started-icon"
          className="object-cover"
        />
      </i>
      <span className="mt-1 block text-[13px] font-semibold leading-4 text-neutral-30">
        {isBonus ? (
          <>
            보너스
            <br />
            미션
          </>
        ) : (
          <>
            {schedule.missionInfo.th}회차
            <br />
            미션
          </>
        )}
      </span>
    </div>
  );
};

export default MissionNotStartedIcon;
