import clsx from 'clsx';

interface Props {
  className?: string;
  mission: any;
}

const MissionNotStartedIcon = ({ className, mission }: Props) => {
  return (
    <div
      className={clsx(
        'flex aspect-square flex-col items-center justify-center rounded-md',
        className,
      )}
    >
      <div className="mb-[0.175rem] flex h-[2rem] w-[2rem] items-center justify-center rounded-full bg-[#D0CFCF]" />
      <span className="block font-pretendard text-xs font-semibold text-[#D0CFCF]">
        {mission.missionTh}일차
      </span>
    </div>
  );
};

export default MissionNotStartedIcon;
