import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';
import { FaCheck, FaPlus } from 'react-icons/fa6';

import { missionSubmitToBadge } from '../../../../../utils/convert';
import { Schedule, ScheduleMission } from '../../../../../schema';

interface Props {
  mission: ScheduleMission;
  attendance: Schedule['attendanceInfo'];
  className: string;
}

const MissionTodayIcon = ({ mission, className, attendance }: Props) => {
  const params = useParams();

  return (
    <>
      <Link
        to={`/challenge/${params.programId}/me?scroll_to=daily-mission`}
        replace
        className={clsx(
          'flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md shadow-[0px_0px_10px_rgba(0,0,0,0.1)]',
          className,
        )}
      >
        {
          attendance.status === 'ABSENT' || attendance.result === 'WRONG' ? (
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
          )
          // ) : mission. === 'ADDITIONAL' ? (
          //   <div className="mb-[0.175rem] flex w-[2.5rem] items-center justify-center">
          //     <i>
          //       <img
          //         src="/icons/additional-contents.svg"
          //         alt="additional contents icon"
          //       />
          //     </i>
          //   </div>
          // ) : mission.missionType === 'REFUND' ? (
          //   <div className="mb-[0.175rem] flex w-[2.5rem] items-center justify-center">
          //     <i>
          //       <img src="/icons/refund.svg" alt="refund icon" />
          //     </i>
          //   </div>
          // ) : (

          // mission.missionType === 'GENERAL' &&
        }
        <span className="font-pretendard text-sm font-semibold text-primary">
          {mission.th}회차
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
              'opacity-0': attendance.status === 'ABSENT',
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
