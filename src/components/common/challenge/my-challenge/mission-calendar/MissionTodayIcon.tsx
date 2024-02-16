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
      to={`/challenge/${params.programId}/me?scroll_to=daily-mission`}
      replace
      className={clsx(
        'flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md shadow-[0px_0px_10px_rgba(0,0,0,0.1)]',
        className,
      )}
    >
      <div className="mb-[0.175rem] flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-primary">
        <i className="text-2xl text-white">
          <FaPlus />
        </i>
      </div>
      <span className="font-pretendard text-sm font-semibold text-primary">
        {mission.missionTh}일차
      </span>
    </Link>
  );
};

export default MissionTodayIcon;
