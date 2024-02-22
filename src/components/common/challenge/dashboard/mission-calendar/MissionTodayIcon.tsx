import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';
import { FaPlus, FaCheck } from 'react-icons/fa6';

interface Props {
  mission: any;
  className: string;
}

const MissionTodayIcon = ({ mission, className }: Props) => {
  const params = useParams();

  return (
    <Link
      to={`/challenge/${params.programId}/me?scroll_to=daily-mission`}
      className={clsx(
        'flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md shadow-[0px_0px_10px_rgba(0,0,0,0.1)]',
        className,
      )}
    >
      {mission.attendanceStatus !== 'ABSENT' ? (
        <div className="mb-[0.175rem] flex h-[2rem] w-[2rem] items-center justify-center rounded-full bg-primary">
          <i className="text-lg text-white">
            <FaCheck />
          </i>
        </div>
      ) : mission.missionType === 'ADDITIONAL' ? (
        <div className="mb-[0.175rem] flex h-[2rem] w-[2rem] items-center justify-center">
          <i>
            <img
              src="/icons/additional-contents.svg"
              alt="additional contents icon"
            />
          </i>
        </div>
      ) : mission.missionType === 'REFUND' ? (
        <div className="mb-[0.175rem] flex h-[2rem] w-[2rem] items-center justify-center">
          <i>
            <img src="/icons/refund.svg" alt="refund icon" />
          </i>
        </div>
      ) : (
        mission.missionType === 'GENERAL' && (
          <div className="mb-[0.175rem] flex h-[2rem] w-[2rem] items-center justify-center">
            <i>
              <img
                src="/icons/general-mission.svg"
                alt="general mission icon"
              />
            </i>
          </div>
        )
      )}
      <span className="font-pretendard text-xs font-semibold text-primary">
        {mission.missionTh}일차
      </span>
    </Link>
  );
};

export default MissionTodayIcon;
