import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa6';

interface Props {
  mission: any;
  className: string;
}

const MissionTodayIcon = ({ mission, className }: Props) => {
  const params = useParams();

  return (
    <Link
      to={`/challenge/${params.programId}/me`}
      className={clsx(
        'flex aspect-square cursor-pointer flex-col items-center justify-end rounded-md shadow-[0px_0px_10px_rgba(0,0,0,0.1)]',
        className,
      )}
    >
      <div className="mb-[0.25rem] flex h-[2rem] w-[2rem] items-center justify-center rounded-full bg-primary">
        <i className="text-lg text-white">
          <FaPlus />
        </i>
      </div>
      <span className="mb-[15%] block font-pretendard text-xs font-semibold text-primary">
        {mission.missionTh}일차
      </span>
    </Link>
  );
};

export default MissionTodayIcon;
