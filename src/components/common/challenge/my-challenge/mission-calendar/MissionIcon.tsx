import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';

interface Props {
  className?: string;
  mission: any;
}

const MissionIcon = ({ className, mission }: Props) => {
  const params = useParams();

  return (
    <Link
      to={`/challenge/${params.programId}/me?scroll_to=other-mission`}
      replace
      className={clsx(
        'relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md text-white',
        className,
        {
          'bg-[#d0cfcf]': !mission.attended,
          'bg-[#928DF8]': mission.attended,
        },
      )}
      style={{
        clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%, 0 30%)',
      }}
    >
      <div
        className={clsx(
          'absolute left-0 top-0 aspect-square w-[30%] rounded-br-md',
          {
            'bg-[#c0c0c0]': !mission.attended,
            'bg-primary': mission.attended,
          },
        )}
      />
      {mission.attended ? (
        <i className="mb-1 mt-2 h-[1.75rem] w-[1.75rem]">
          <img
            src="/icons/check-icon.svg"
            alt="check-icon"
            className="w-full object-cover"
          />
        </i>
      ) : (
        <i className="mb-2 mt-2 h-[1.25rem] w-[1.25rem]">
          <img
            src="/icons/x-icon.svg"
            alt="not-started-icon"
            className="w-full object-cover"
          />
        </i>
      )}
      <span className="font-pretendard text-sm font-semibold">
        {mission.missionTh}일차
      </span>
    </Link>
  );
};

export default MissionIcon;
