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
      <div className="mb-[0.175rem] h-[2.5rem] w-[2.5rem] rounded-full bg-[#D0CFCF]" />
      <span className="block font-pretendard text-sm font-semibold text-[#D0CFCF]">
        {mission.missionTh}일차
      </span>
    </div>
  );
};

export default MissionNotStartedIcon;
