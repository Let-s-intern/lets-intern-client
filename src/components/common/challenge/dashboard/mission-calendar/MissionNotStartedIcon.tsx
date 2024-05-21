import clsx from 'clsx';

interface Props {
  className?: string;
  mission: any;
}

const MissionNotStartedIcon = ({ className, mission }: Props) => {
  return (
    <div
      className={clsx(
        'flex aspect-square flex-col items-center justify-center rounded-xs',
        className,
      )}
    >
      <div className="mb-[0.175rem] flex h-[2rem] w-[2rem] items-center justify-center rounded-full bg-[#D0CFCF]" />
      <span className="block font-pretendard text-xs font-semibold text-[#D0CFCF]">
        {mission.missionTh}회차
      </span>
    </div>
  );
};

export default MissionNotStartedIcon;
