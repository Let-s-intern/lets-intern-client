import clsx from 'clsx';
import { FaCheck } from 'react-icons/fa6';
import { Link, useParams } from 'react-router-dom';

import { Schedule, ScheduleMission } from '../../../../../schema';
import { missionSubmitToBadge } from '../../../../../utils/convert';

interface Props {
  mission: ScheduleMission;
  attendance: Schedule['attendanceInfo'];
  className: string;
  isDone: boolean;
}

const MissionTodayIcon = ({
  mission,
  className,
  attendance,
  isDone,
}: Props) => {
  const params = useParams();

  return (
    <>
      <Link
        to={
          !isDone
            ? `/challenge/${params.applicationId}/${params.programId}/me?scroll_to=daily-mission`
            : '#'
        }
        replace
        className={clsx(
          'flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md shadow-[0px_0px_10px_rgba(0,0,0,0.1)]',
          {
            'cursor-default': isDone,
          },
          className,
        )}
      >
        {attendance.status === 'ABSENT' ||
        attendance.result === 'WRONG' ||
        attendance.result === null ? (
          <div className="mb-[10%] flex h-[30%] w-[50%] min-w-[2.5rem] items-center justify-center">
            <img
              src="/icons/general-mission.svg"
              alt="general mission icon"
              className="w-full"
            />
          </div>
        ) : (
          <div className="mb-[10%] flex h-[30%] w-[50%] min-w-[2.5rem] items-center justify-center rounded-full bg-primary">
            <i className="text-2xl text-white">
              <FaCheck />
            </i>
          </div>
        )}
        <span className="text-sm font-semibold text-primary">
          {mission.th === 100 ? '보너스' : `${mission.th}회차`}
        </span>
      </Link>
      <div className="mt-2 flex items-center justify-center">
        <span
          className={clsx(
            'rounded-xs px-2 py-[0.125rem] text-sm',
            missionSubmitToBadge({
              status: attendance.status,
              result: attendance.result,
            }).style,
            {
              'opacity-0':
                attendance.status === 'ABSENT' || attendance.result === null,
            },
          )}
        >
          {
            missionSubmitToBadge({
              status: attendance.status,
              result: attendance.result,
            }).text
          }
        </span>
      </div>
    </>
  );
};

export default MissionTodayIcon;
