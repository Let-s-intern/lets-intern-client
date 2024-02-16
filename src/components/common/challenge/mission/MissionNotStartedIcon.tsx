import clsx from 'clsx';
import { FaPlus } from 'react-icons/fa6';

interface Props {
  className?: string;
  mission: any;
}

const MissionNotStartedIcon = ({ className, mission }: Props) => {
  return (
    <div
      className={clsx(
        'flex aspect-square flex-col items-center justify-end rounded-md',
        className,
      )}
    >
      <div className="mb-[0.25rem] flex h-[2rem] w-[2rem] items-center justify-center rounded-full bg-[#D0CFCF]" />
      <span className="mb-[15%] block font-pretendard text-xs font-semibold text-[#D0CFCF]">
        {mission.missionTh}일차
      </span>
    </div>
  );
};

export default MissionNotStartedIcon;
